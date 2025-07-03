import { initializeWebSocket } from "../../services/transcriptionService.js";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import cookie from "cookie";

// Mock config values
jest.mock("../../utils/config.js", () => ({
  JWT_SECRET: "mock-secret",
  SAMPLE_RATE: 16000,
}));

// Mock vosk
const mockRecognizer = {
  acceptWaveform: jest.fn(),
  result: jest.fn(),
  partialResult: jest.fn(),
  free: jest.fn(),
};

jest.mock("vosk", () => ({
  Recognizer: jest.fn(() => mockRecognizer),
  Model: jest.fn(() => ({})),
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

jest.mock("cookie", () => ({
  parse: jest.fn(),
}));

describe("transcriptionService - initializeWebSocket", () => {
  let serverMock, clientMock, modelMock;

  beforeEach(() => {
    clientMock = {
      on: jest.fn(),
      send: jest.fn(),
      close: jest.fn(),
    };

    serverMock = {
      on: jest.fn(),
    };

    modelMock = {}; // dummy
    jest.clearAllMocks();
  });

  it("rejects WebSocket when token is missing", () => {
    cookie.parse.mockReturnValue({});

    serverMock.on.mockImplementation((event, handler) => {
      if (event === "connection") {
        handler(clientMock, { headers: {} });
      }
    });

    initializeWebSocket(serverMock, modelMock);

    expect(clientMock.close).toHaveBeenCalledWith(4002, "Missing authentication token");
  });

  it("rejects WebSocket with invalid token", () => {
    cookie.parse.mockReturnValue({ token: "bad" });
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    serverMock.on.mockImplementation((event, handler) => {
      if (event === "connection") {
        handler(clientMock, { headers: { cookie: "token=bad" } });
      }
    });

    initializeWebSocket(serverMock, modelMock);

    expect(clientMock.close).toHaveBeenCalledWith(4002, "Invalid or expired token");
  });

  it("handles a final result", () => {
    cookie.parse.mockReturnValue({ token: "valid" });
    jwt.verify.mockReturnValue({ id: "user123" });
    mockRecognizer.acceptWaveform.mockReturnValue(true);
    mockRecognizer.result.mockReturnValue({ text: "final transcript" });

    const handlers = {};
    clientMock.on.mockImplementation((event, cb) => {
      handlers[event] = cb;
    });

    serverMock.on.mockImplementation((event, cb) => {
      if (event === "connection") cb(clientMock, { headers: { cookie: "token=valid" } });
    });

    initializeWebSocket(serverMock, modelMock);

    handlers["message"](Buffer.from("audio"), true);

    expect(clientMock.send).toHaveBeenCalledWith(JSON.stringify({ final: "final transcript" }));
  });

  it("handles a partial result", () => {
    cookie.parse.mockReturnValue({ token: "valid" });
    jwt.verify.mockReturnValue({ id: "user123" });
    mockRecognizer.acceptWaveform.mockReturnValue(false);
    mockRecognizer.partialResult.mockReturnValue({ partial: "partial transcript" });

    const handlers = {};
    clientMock.on.mockImplementation((event, cb) => {
      handlers[event] = cb;
    });

    serverMock.on.mockImplementation((event, cb) => {
      if (event === "connection") cb(clientMock, { headers: { cookie: "token=valid" } });
    });

    initializeWebSocket(serverMock, modelMock);

    handlers["message"](Buffer.from("audio"), true);

    expect(clientMock.send).toHaveBeenCalledWith(JSON.stringify({ partial: "partial transcript" }));
  });

  it("cleans up on WebSocket close", () => {
    cookie.parse.mockReturnValue({ token: "valid" });
    jwt.verify.mockReturnValue({ id: "user123" });

    const handlers = {};
    clientMock.on.mockImplementation((event, cb) => {
      handlers[event] = cb;
    });

    serverMock.on.mockImplementation((event, cb) => {
      if (event === "connection") cb(clientMock, { headers: { cookie: "token=valid" } });
    });

    initializeWebSocket(serverMock, modelMock);

    handlers["close"]();

    expect(mockRecognizer.free).toHaveBeenCalled();
  });
});
