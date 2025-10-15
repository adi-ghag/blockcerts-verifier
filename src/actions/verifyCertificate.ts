import domain from '../domain';
import * as ACTIONS from '../constants/actionTypes';
import * as CERTIFICATE_EVENTS from '../constants/certificateEvents';
import stepVerified from './stepVerified';
import clearVerifiedSteps from './clearVerifiedSteps';
import updateVerificationStatus from './updateVerificationStatus';
import { getCertificateDefinition } from '../selectors/certificate';
import { getDisableVerify } from '../selectors/api';
import updateFinalStep from './updateFinalStep';
import { VERIFICATION_STATUSES } from '../constants/verificationStatuses';
import type { IFinalVerificationStatus } from '@adityaghag/cert-verifier-js';
import type { Dispatch } from 'redux';
import type { BlockcertsVerifierState } from '../store/getInitialState';
import type { ThunkAction } from 'redux-thunk';
import type { Action } from './action';

export default function verifyCertificate (): ThunkAction<Promise<void>, BlockcertsVerifierState, any, Action<void>> {
  return async function (dispatch: Dispatch, getState: () => BlockcertsVerifierState): Promise<void> {
    const state = getState();

    if (getDisableVerify(state)) {
      console.warn('Verification is disabled');
      return;
    }

    dispatch({
      type: ACTIONS.VERIFY_CERTIFICATE
    });

    dispatch(updateVerificationStatus(VERIFICATION_STATUSES.STARTING));

    // @ts-expect-error TODO properly type actions in TS
    dispatch(clearVerifiedSteps());
    const certificateDefinition = getCertificateDefinition(state);

    if (certificateDefinition) {
      domain.events.dispatch(CERTIFICATE_EVENTS.CERTIFICATE_VERIFY, certificateDefinition);
      const finalStep: IFinalVerificationStatus = await certificateDefinition.verify(stepDefinition => {
        // @ts-expect-error TODO properly type actions in TS
        dispatch(stepVerified(stepDefinition));
      });

      dispatch(updateFinalStep(finalStep.message as any));
      dispatch(updateVerificationStatus(finalStep.status));
    }
  };
}
