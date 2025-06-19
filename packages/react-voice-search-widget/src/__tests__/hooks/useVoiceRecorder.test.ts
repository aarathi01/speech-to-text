import { renderHook, act } from '@testing-library/react';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';

// Mock global WebSocket
global.WebSocket = vi.fn(() => ({
  binaryType: '',
  send: vi.fn(),
  close: vi.fn(),
  readyState: 1,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
})) as unknown as typeof WebSocket;

// Mock AudioContext
class MockAudioContext {
  sampleRate = 44100;
  createMediaStreamSource = vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
  }));
  createScriptProcessor = vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    onaudioprocess: vi.fn(),
  }));
  destination = {};
  close = vi.fn();
}
vi.stubGlobal('AudioContext', MockAudioContext as unknown);

// Mock getUserMedia
vi.stubGlobal('navigator', {
  mediaDevices: {
    getUserMedia: vi.fn(() =>
      Promise.resolve(new MediaStream())
    ),
  },
});

vi.mock('../../config/apiConfig', () => ({
  BASE_URL: 'http://localhost:5000/api',
}));

vi.mock('../../utils/errorHandler', () => ({
  showError: vi.fn(),
}));

describe('useVoiceRecorder', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'mock-token');
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should toggle listening with handleMicClick', async () => {
    const { result } = renderHook(() => useVoiceRecorder());

    await act(async () => {
      await result.current.handleMicClick(); // start
    });

    expect(result.current.listening).toBe(true);

    await act(async () => {
      result.current.handleMicClick(); // stop
    });

    expect(result.current.listening).toBe(false);
  });

  it('should update transcript on input change', () => {
    const { result } = renderHook(() => useVoiceRecorder());

    const event = {
      target: { value: 'hello world' },
    } as React.ChangeEvent<HTMLTextAreaElement>;

    act(() => {
      result.current.handleInputChange(event);
    });

    expect(result.current.fullTranscript).toBe('hello world');
  });

  it('should clear transcript', () => {
    const { result } = renderHook(() => useVoiceRecorder());

    act(async () => {
      result.current.setFullTranscript('Sample speech');
      await result.current.handleClear();
    });

    expect(result.current.fullTranscript).toBe('');
  });

});
