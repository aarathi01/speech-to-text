/// <reference types="vitest" />
import '@testing-library/jest-dom';

declare module 'vitest' {
  interface Assertion<> {
    toBeInTheDocument(): void;
    // Add more custom matchers here if needed
  }
}
