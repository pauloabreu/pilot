import { createAction } from 'redux-actions'

export { default } from './reducer'
export { default as epic } from './epic'

export const LOGIN_REQUEST = 'pilot/account/LOGIN_REQUEST'
export const requestLogin = createAction(LOGIN_REQUEST)

export const LOGOUT_REQUEST = 'pilot/account/LOGOUT_REQUEST'
export const requestLogout = createAction(LOGOUT_REQUEST)

export const RESET_STATE = 'pilot/account/RESET_STATE'
export const resetState = createAction(RESET_STATE)

export const LOGIN_RECEIVE = 'pilot/account/LOGIN_RECEIVE'
export const receiveLogin = createAction(LOGIN_RECEIVE)

export const ACCOUNT_RECEIVE = 'pilot/account/ACCOUNT_RECEIVE'
export const receiveAccount = createAction(ACCOUNT_RECEIVE)

export const COMPANY_RECEIVE = 'pilot/account/COMPANY_RECEIVE'
export const receiveCompany = createAction(COMPANY_RECEIVE)

export const LOGIN_FAIL = 'pilot/account/LOGIN_FAIL'
export const failLogin = createAction(LOGIN_FAIL)

export const RECIPIENT_BALANCE_RECEIVE = 'pilot/account/RECIPIENT_BALANCE_RECEIVE'
export const receiveRecipientBalance = createAction(RECIPIENT_BALANCE_RECEIVE)
