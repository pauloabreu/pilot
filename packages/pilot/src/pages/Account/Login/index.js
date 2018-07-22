import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import { translate } from 'react-i18next'

import { compose } from 'ramda'
import { connect } from 'react-redux'

import LoginForm from '../../../containers/Account/LoginForm'

import { requestLogin, resetState } from '../actions'

import buildParamErrors from './buildParamErrors'

import environment from '../../../environment'

const mapStateToProps = (state) => {
  const {
    account: {
      error,
      loading,
      token,
    },
  } = state

  return {
    error,
    loading,
    token,
  }
}

const mapDispatchToProps = dispatch => ({
  onLogin: (data) => {
    dispatch(requestLogin({ ...data, environment }))
  },
  resetState: () => {
    dispatch(resetState())
  },
})

const enhanced = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  translate(),
  withRouter
)
class LoginPage extends PureComponent {
  componentWillUnmount () {
    this.props.resetState()
  }

  // eslint-disable-next-line class-methods-use-this
  handlePasswordRecovery (e) {
    e.preventDefault()
    window.location = 'https://dashboard.pagar.me/#/forgot_password'
  }

  render () {
    const {
      base,
      error,
      loading,
      onLogin,
      t,
    } = this.props
    return (
      <LoginForm
        base={base}
        errors={buildParamErrors(error)}
        loading={loading}
        onLogin={onLogin}
        onPasswordRecovery={this.handlePasswordRecovery}
        t={t}
      />
    )
  }
}

LoginPage.propTypes = {
  base: PropTypes.oneOf(['dark', 'light']).isRequired,
  error: PropTypes.instanceOf(Error),
  loading: PropTypes.bool,
  onLogin: PropTypes.func.isRequired,
  resetState: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

LoginPage.defaultProps = {
  error: null,
  loading: false,
}

export default enhanced(LoginPage)
