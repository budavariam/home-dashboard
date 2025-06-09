import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest'
import { jest } from '@jest/globals';

global.jest = jest;

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup();
})