import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { translate } from 'react-i18next'
import { compose } from 'ramda'
import pagarme from 'pagarme'
import { SignUpForm } from '../../../containers/Account/SignUp'
import buildParamErrors from '../Login/buildParamErrors'

const enhanced = compose(
  translate(),
  withRouter
)

class SignUpPage extends PureComponent {
  constructor () {
    super()

    this.state = {
      error: null,
      loading: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (data, validationErrors) {
    const {
      history,
    } = this.props

    if (!validationErrors) {
      this.setState({
        loading: true,
        error: null,
      })

      pagarme.client.company.create({}, data)
        .then(() => {
          this.setState({
            loading: false,
          })

          history.replace('/account/signup/confirmation')
        })
        .catch((requestError) => {
          this.setState({
            error: requestError,
            loading: false,
          })
        })
    }
  }

  render () {
    const {
      error,
      loading,
    } = this.state

    return (
      <SignUpForm
        errors={buildParamErrors(error)}
        loading={loading}
        onSubmit={this.handleSubmit}
        t={this.props.t}
      />
    )
  }
}

SignUpPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }).isRequired,
  t: PropTypes.func.isRequired,
}

export default enhanced(SignUpPage)
