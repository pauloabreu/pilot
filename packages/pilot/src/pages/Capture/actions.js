import { createAction } from 'redux-actions'

export const CAPTURE_REQUEST = 'pilot/refund/CAPTURE_REQUEST'
export const requestCapture = createAction(CAPTURE_REQUEST)

export const CAPTURE_RECEIVE = 'pilot/refund/CAPTURE_RECEIVE'
export const receiveCapture = createAction(CAPTURE_RECEIVE)
