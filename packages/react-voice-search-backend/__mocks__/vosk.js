const mockRecognizer = jest.fn().mockImplementation(() => ({
  acceptWaveform: jest.fn(),
  result: jest.fn(),
  partialResult: jest.fn(),
}));

export default {
  Recognizer: mockRecognizer,
};
