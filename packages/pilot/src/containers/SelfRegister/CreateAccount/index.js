import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  FormInput,
} from 'former-kit'
import {
  always,
  equals,
  F,
  ifElse,
} from 'ramda'
import Form from 'react-vanilla-form'
import { validate } from 'p4g4rm3'

import PasswordInput from '../../../components/PasswordInput'

import emailValidation from '../../../validation/email'
import HeaderImage from '../../../components/SelfRegister/HeaderImage'
import { Message } from '../../../components/Message'
import requiredValidation from '../../../validation/required'
import style from '../style.css'

const equalsString = (t, str1) => ifElse(
  equals(str1),
  F,
  always(t('pages.self_register.different_passwords_error'))
)

const step = 'create-account'

const isEmail = t => emailValidation(t('validations.isEmail'))

class SelfRegisterCreateAccount extends Component {
  constructor (props) {
    super(props)

    this.state = {
      continueActionDisabled: true,
      formData: {
        accountEmail: '',
        password: '',
        ...props.registerData,
      },
      showPopover: false,
      validations: validate(''),
    }

    this.handleFormChange = this.handleFormChange.bind(this)
    this.handlePasswordBlur = this.handlePasswordBlur.bind(this)
    this.handlePasswordFocus = this.handlePasswordFocus.bind(this)
  }

  handleFormChange (data) {
    const validations = validate(data.password)
    const continueActionDisabled = !validations.isValid

    this.setState({
      continueActionDisabled,
      formData: data,
      validations,
    })
  }

  handlePasswordFocus () {
    this.setState({
      showPopover: true,
    })
  }

  handlePasswordBlur () {
    const {
      validations: {
        isValid,
        score,
      },
    } = this.state

    if (isValid && score >= 2) {
      this.setState({
        showPopover: false,
      })
    }
  }

  render () {
    const { onSubmit, t } = this.props
    const {
      continueActionDisabled,
      formData: {
        password,
      },
      showPopover,
      validations,
    } = this.state

    const isRequired = requiredValidation(t('pages.self_register.required_error'))

    return (
      <Fragment>
        <Message
          image={<HeaderImage step={step} />}
          message={
            <span className={style.headerBody}>
              {t('pages.self_register.create_account.attraction')}
            </span>
          }
          title={
            <p className={style.headerTitle}>
              {t('pages.self_register.create_account.welcome')}
            </p>
          }
        />

        <Form
          className={style.fillWidth}
          data={{
            ...this.state.formData,
          }}
          onChange={this.handleFormChange}
          onSubmit={onSubmit}
          validation={{
            email: [isRequired, isEmail(t)],
            password: isRequired,
            confirmPassword: [isRequired, equalsString(t, password)],
          }}
        >
          <FormInput
            label={t('pages.self_register.create_account.email')}
            name="email"
          />

          <PasswordInput
            label={t('pages.self_register.create_account.password')}
            name="password"
            onBlur={this.handlePasswordBlur}
            onFocus={this.handlePasswordFocus}
            showPopover={showPopover}
            t={t}
            validations={validations}
          />

          <FormInput
            label={t('pages.self_register.create_account.confirm_password')}
            name="confirmPassword"
            type="password"
          />

          <span className={style.buttonSubmit}>
            <Button
              disabled={continueActionDisabled}
              fill="gradient"
              size="huge"
              type="submit"
            >
              {t('pages.self_register.create_account.continue')}
            </Button>
          </span>
        </Form>
      </Fragment>
    )
  }
}

SelfRegisterCreateAccount.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  registerData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

SelfRegisterCreateAccount.defaultProps = {
  registerData: {},
}

export default SelfRegisterCreateAccount
