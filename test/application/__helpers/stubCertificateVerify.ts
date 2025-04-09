import sinon from 'sinon';
import { Certificate, retrieveBlockcertsVersion, VERIFICATION_STATUSES } from '@blockcerts/cert-verifier-js';
import { Certificate as CertificateV1 } from '@blockcerts/cert-verifier-js-v1-legacy';
import domain from '../../../src/domain';
import validCertificateStepsAssertions from '../../assertions/validCertificateSteps';
import invalidCertificateStepsAssertions from '../../assertions/invalidCertificateSteps';
import type { Blockcerts, IVerificationMapItem, Signers, BlockcertsVersion } from '@blockcerts/cert-verifier-js';

function updateStep (stepsCb, step: IVerificationMapItem): void {
  step.subSteps.forEach(substep => stepsCb(substep));
  step.suites?.forEach(suite => {
    suite.subSteps.forEach(substep => stepsCb(substep));
  });
}

function validVerifyStub (stepsCb: () => any): any {
  validCertificateStepsAssertions.forEach(updateStep.bind(null, stepsCb));
  return {
    status: VERIFICATION_STATUSES.SUCCESS,
    message: {
      label: 'Verified',
       
      description: 'This is a valid ${chain} certificate.',
      linkText: 'View transaction link'
    }
  };
}

function invalidVerifyStub (stepsCb): any {
  invalidCertificateStepsAssertions.forEach(updateStep.bind(null, stepsCb));
  return {
    status: VERIFICATION_STATUSES.FAILURE,
    message: {
      label: 'Error'
    }
  };
}

export default function stubCertificateVerify (certificateFixture: Blockcerts, signers: Signers[] = [], valid = true): void {
  if (!certificateFixture) {
    throw new Error('No certificate definition passed to mock its verify option. Make sure to pass the same certificate as the one you will put in the state for the test.');
  }

  const fixtureVersion: BlockcertsVersion = retrieveBlockcertsVersion(certificateFixture['@context']);

  let domainParseStub;

  beforeEach(async function () {
    let parsedCertificate;
    if (fixtureVersion.versionNumber === 1) {
      parsedCertificate = new CertificateV1(certificateFixture);
    } else {
      parsedCertificate = new Certificate(certificateFixture);
    }
    await parsedCertificate.init();
    domainParseStub = sinon.stub(domain.certificates, 'parse').returns({
      certificateDefinition: {
        ...parsedCertificate,
        verify: valid ? validVerifyStub : invalidVerifyStub,
        signers
      }
    });
    global.domainParseStub = domainParseStub;
  });

  afterEach(function () {
    domainParseStub.restore();
  });
}
