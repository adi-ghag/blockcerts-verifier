import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'istanbul'
    },
    exclude: ['node_modules', 'test/e2e/*.test.ts']
  }
});
