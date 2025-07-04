// Mock cookie module properly for named import
jest.mock("cookie", () => ({
  parse: jest.fn(),
}));

import { parse } from "cookie";

import { verifyWebSocketToken } from "../../utils/authSocket.js";
import * as jwtUtils from "../../utils/jwt.js";

describe("verifyWebSocketToken", () => {
  let ws;
  let req;

  beforeEach(() => {
    ws = {
      close: jest.fn(),
    };

    req = {
      headers: {
        cookie: "token=validtoken",
      },
    };

    jest.clearAllMocks();
  });

  it("should return null and close connection if no token", () => {
    req.headers.cookie = "";
    parse.mockReturnValue({}); // correctly mocking cookie.parse

    const result = verifyWebSocketToken(req, ws);

    expect(ws.close).toHaveBeenCalledWith(4002, "Missing authentication token");
    expect(result).toBeNull();
  });

  it("should return null and close connection for invalid token", () => {
    parse.mockReturnValue({ token: "invalidtoken" });
    jest.spyOn(jwtUtils, "verifyToken").mockReturnValue(null);

    const result = verifyWebSocketToken(req, ws);

    expect(jwtUtils.verifyToken).toHaveBeenCalledWith("invalidtoken");
    expect(ws.close).toHaveBeenCalledWith(4002, "Invalid or expired token");
    expect(result).toBeNull();
  });

  it("should return decoded token if valid", () => {
    const mockPayload = { id: "user123", role: "user" };
    parse.mockReturnValue({ token: "validtoken" });
    jest.spyOn(jwtUtils, "verifyToken").mockReturnValue(mockPayload);

    const result = verifyWebSocketToken(req, ws);

    expect(jwtUtils.verifyToken).toHaveBeenCalledWith("validtoken");
    expect(ws.close).not.toHaveBeenCalled();
    expect(result).toEqual(mockPayload);
  });
});
