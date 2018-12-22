import {
  call,
  put,
  takeEvery
} from 'redux-saga/effects';

import deleteActivity from '../actions/deleteActivity';
import { INCOMING_ACTIVITY } from '../actions/incomingActivity';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isTypingActivity({ type, payload }) {
  return type === INCOMING_ACTIVITY && payload.activity.type === 'typing';
}

export default function* () {
  yield takeEvery(isTypingActivity, function* ({ payload: { activity: { id } } }) {
    yield call(sleep, 5000);
    yield put(deleteActivity(id));
  });
}
