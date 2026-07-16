import { vi } from 'vitest';

// Make jest.fn() available for compatibility with existing tests
global.jest = global.jest || {};
global.jest.fn = vi.fn;

import '@testing-library/jest-dom';
