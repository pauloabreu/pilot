import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-vanilla-form'
import {
  Button,
  FormInput,
} from 'former-kit'

import isEmail from '../../../validation/email'

import styles from '../style.css'

const PasswordRecoveryForm = ({
  errors,
  loading,
  onBackToLogin,
  onSubmit,
  t,
}) => (
  <Form
    className={styles.resetPassword}
    errors={errors}
    onSubmit={onSubmit}
    validation={{
      email: isEmail(t('sign_up.invalid_email')),
    }}
  >
    <div className={styles.login}>
      <span className={styles.recoveryCall}>
        {t('password_recovery.recovery_call')}
      </span>
      <FormInput
        className={styles.input}
        disabled={loading}
        label={t('email')}
        name="email"
        type="email"
      />
    </div>
    <div className={styles.actions}>
      <div className={styles.hugeButton}>
        <Button
          disabled={loading}
          fill="gradient"
          size="huge"
          type="submit"
        >
          {t('password_recovery.recovery_action')}
        </Button>
      </div>
      <button
        disabled={loading}
        onClick={onBackToLogin}
        role="link"
      >
        {t('back_login_action')}
      </button>
    </div>
  </Form>
)

PasswordRecoveryForm.propTypes = {
  errors: PropTypes.shape({
    email: PropTypes.string,
  }),
  loading: PropTypes.bool,
  onBackToLogin: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

PasswordRecoveryForm.defaultProps = {
  errors: null,
  loading: false,
}

export default PasswordRecoveryForm
