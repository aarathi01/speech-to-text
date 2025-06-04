import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import VoiceInput from "../VoiceInput";

// Polyfill for jsdom
globalThis.MediaStream = class {} as any;

// Mocks
beforeAll(() => {
  Object.defineProperty(navigator, "mediaDevices", {
    writable: true,
    value: {
      getUserMedia: vi.fn().mockResolvedValue(new MediaStream()),
    },
  });

  class AudioContextMock {
    sampleRate = 44100;
    createMediaStreamSource = vi.fn().mockReturnValue({ connect: vi.fn(), disconnect: vi.fn() });
    createScriptProcessor = vi.fn().mockReturnValue({
      connect: vi.fn(),
      disconnect: vi.fn(),
      onaudioprocess: vi.fn(),
    });
    close = vi.fn();
  }

  Object.defineProperty(window, "AudioContext", {
    writable: true,
    value: AudioContextMock,
  });

  Object.defineProperty(window, "webkitAudioContext", {
    writable: true,
    value: AudioContextMock,
  });
});

describe("VoiceInput", () => {
  it("renders header and mic icon", () => {
    render(<VoiceInput />);
    expect(screen.getByText("Voice Search")).toBeInTheDocument();
    expect(screen.getByAltText("Mic")).toBeInTheDocument();
  });

  it("clears transcript on Clear click", () => {
    render(<VoiceInput />);
    const textarea = screen.getByPlaceholderText("Type or speak here...");
    fireEvent.change(textarea, { target: { value: "hello" } });
    expect(textarea).toHaveValue("hello");
    fireEvent.click(screen.getByText("Clear"));
    expect(textarea).toHaveValue("");
  });

  it("calls getUserMedia on mic click", async () => {
    render(<VoiceInput />);
    fireEvent.click(screen.getByText(/Click to speak/i));
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
  });
});
