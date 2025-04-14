import { describe, expect, it, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { getDisplayAsHTML } from '../../../../src/selectors/certificate';
import updateCertificateDefinition from '../../../../src/actions/updateCertificateDefinition';
import v3Fixture from '../../../fixtures/v3/testnet-v3.0-beta.json';
import { configureStore } from '../../../../src/store';
import getInitialState from '../../../../src/store/getInitialState';
import stubCertificateVerify from '../../__helpers/stubCertificateVerify';
import { FakeXmlHttpRequest } from '../../__helpers/FakeXmlHttpRequest';

describe('getDisplayAsHTML selector', function () {
  let store;
  const initialXhr = XMLHttpRequest;

  beforeAll(function () {
    (global.XMLHttpRequest as any) = FakeXmlHttpRequest;
  });

  afterAll(function () {
    global.XMLHttpRequest = initialXhr;
  });

  beforeEach(function () {
    const initialState = getInitialState({ disableVerify: true });
    store = configureStore(initialState);
  });

  afterEach(function () {
    store = null;
  });

  describe('given the certificate is a certificate with a display property', function () {
    stubCertificateVerify(v3Fixture as any);

    describe('and the type is text/html', function () {
      it('should return the display HTML as coded into the document', async function () {
        await store.dispatch(updateCertificateDefinition(v3Fixture as any));
        const state = store.getState();
        expect(getDisplayAsHTML(state)).toBe('<b>hello world</b>');
      });
    });
  });
});
