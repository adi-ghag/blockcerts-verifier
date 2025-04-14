import { describe, expect, it } from 'vitest';
import getSupportedLanguages from '../../../src/i18n/getSupportedLanguages';

describe('domain i18n getSupportedLanguages use case test suite', () => {
  const assertionSupportedLanguages = ['en', 'es', 'fr', 'it', 'ja'];

  it('should return an array of supported languages', () => {
    const res = getSupportedLanguages();
    expect(res).toEqual(assertionSupportedLanguages);
  });
});
