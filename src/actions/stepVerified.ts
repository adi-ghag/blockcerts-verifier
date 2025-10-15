import * as ACTIONS from '../constants/actionTypes';
import updateParentStepStatus from './updateParentStepStatus';
import stepQueueFactory from '../helpers/stepQueue';
import type { ThunkAction } from 'redux-thunk';
import type { Action } from './action';
import type { VerificationSubstep } from '@adityaghag/cert-verifier-js';

const stepQueue = stepQueueFactory();

function dispatchActionsFactory (dispatch) {
  return function dispatchActions (step) {
    dispatch({
      type: ACTIONS.STEP_VERIFIED,
      payload: step
    });

    dispatch(updateParentStepStatus(step.parentStep));
  };
}

export default function stepVerified (stepDefinition: VerificationSubstep): ThunkAction<void, any, void, Action<VerificationSubstep>> {
  return function (dispatch, getState) {
    const dispatchActions = dispatchActionsFactory(dispatch);
    if (!stepQueue.dispatchCb) {
      // register only once
      stepQueue.registerCb(dispatchActions);
    }
    stepQueue.push(stepDefinition);
    stepQueue.execute();
  };
}
