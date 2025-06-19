import '@testing-library/jest-dom';

if (typeof global.MediaStream === "undefined") {
  global.MediaStream = class MediaStreamMock {} as any;
}