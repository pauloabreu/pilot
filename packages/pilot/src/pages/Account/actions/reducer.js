import {
  applySpec,
  merge,
  path,
} from 'ramda'

import {
  ACCOUNT_RECEIVE,
  COMPANY_RECEIVE,
  LOGIN_FAIL,
  LOGIN_RECEIVE,
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  RECIPIENT_BALANCE_RECEIVE,
  RESET_STATE,
} from '.'

const getBalance = applySpec({
  available: path(['available', 'amount']),
  waitingFunds: path(['waiting_funds', 'amount']),
})

const initialState = {
  loading: false,
  sessionId: null,
}

export default function loginReducer (state = initialState, action) {
  switch (action.type) {
    case ACCOUNT_RECEIVE: {
      return merge(state, {
        error: null,
        user: action.payload,
      })
    }

    case COMPANY_RECEIVE: {
      return merge(state, {
        company: action.payload,
        error: null,
        loading: false,
      })
    }

    case LOGIN_REQUEST: {
      return merge(state, {
        error: null,
        loading: true,
        user: null,
      })
    }
    case LOGIN_FAIL: {
      return merge(
        state,
        {
          client: null,
          error: action.payload,
          loading: false,
          sessionId: null,
          user: null,
        }
      )
    }
    case LOGIN_RECEIVE: {
      return merge(
        state,
        {
          client: action.payload,
          error: null,
          loading: false,
          sessionId: action.payload.authentication.session_id,
        }
      )
    }

    case LOGOUT_REQUEST:
    case RESET_STATE: {
      return initialState
    }

    case RECIPIENT_BALANCE_RECEIVE: {
      return merge(
        state,
        {
          balance: getBalance(action.payload),
        }
      )
    }

    default:
      return state
  }
}
