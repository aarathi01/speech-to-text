import '@testing-library/jest-dom';

if (typeof globalThis.MediaStream === 'undefined') {
  class MediaStreamMock implements MediaStream {
    id: string;
    active = false;
    onaddtrack: ((this: MediaStream, ev: MediaStreamTrackEvent) => void) | null = null;
    onremovetrack: ((this: MediaStream, ev: MediaStreamTrackEvent) => void) | null = null;

    addTrack(): void {}
    removeTrack(): void {}
    getAudioTracks(): MediaStreamTrack[] { return []; }
    getVideoTracks(): MediaStreamTrack[] { return []; }
    getTracks(): MediaStreamTrack[] { return []; }
    getTrackById(): MediaStreamTrack | null { return null; }
    clone(): MediaStream { return this; }
    addEventListener(): void {}
    removeEventListener(): void {}
    dispatchEvent(): boolean { return true; }
  }

  globalThis.MediaStream = MediaStreamMock;
}
