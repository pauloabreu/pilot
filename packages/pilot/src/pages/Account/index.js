import React from 'react'
import PropTypes from 'prop-types'
import {
  Redirect,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom'

import {
  compose,
  contains,
} from 'ramda'

import { translate } from 'react-i18next'

import Account from '../../containers/Account'
import InvalidEmailError from './SignUp/InvalidEmailError'
import Login from './Login'
import Logo from '../../components/Logo/logo.svg'
import PasswordRecovery from './PasswordRecovery'
import PasswordRecoveryConfirmation from './PasswordRecovery/Confirmation'
import Presentation from './Presentation'
import SignUp from './SignUp'
import SignUpConfirmation from './SignUp/Confirmation'
import TestLogo from '../../components/Logo/TestLogo'

import environment from '../../environment'

const DARK_BASE = 'dark'
const LIGHT_BASE = 'light'

const getBaseByPath = (pathname) => {
  if (contains('account/login', pathname) && environment === 'live') {
    return LIGHT_BASE
  }
  return DARK_BASE
}

const getEnvironmentLogo = () => (
  environment === 'live'
    ? Logo
    : TestLogo
)

const enhance = compose(
  withRouter,
  translate()
)

const AccountArea = ({ t, history: { location } }) => {
  const base = getBaseByPath(location.pathname)
  return (
    <Account
      t={t}
      logo={getEnvironmentLogo()}
      base={base}
      primaryContent={
        <Switch>
          <Route
            path="/account/login"
            render={() => <Login base={base} />}
          />
          <Route
            path="/account/password/recovery/confirmation"
            component={PasswordRecoveryConfirmation}
          />
          <Route
            path="/account/password/recovery"
            component={() => <PasswordRecovery base={base} />}
          />
          <Route
            path="/account/signup/confirmation"
            component={SignUpConfirmation}
          />
          <Route
            path="/account/signup/error"
            component={InvalidEmailError}
          />
          <Route
            path="/account/signup"
            component={() => <SignUp base={base} />}
          />
          <Redirect to="/account/login" />
        </Switch>
      }
      secondaryContent={
        <Switch>
          <Route
            path="/account"
            component={Presentation}
          />
          <Redirect to="/account/login" />
        </Switch>
      }
    />
  )
}

AccountArea.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
  }).isRequired,
}

export default enhance(AccountArea)
