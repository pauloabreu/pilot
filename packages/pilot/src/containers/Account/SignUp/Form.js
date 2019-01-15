import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-vanilla-form'
import {
  Button,
  FormInput,
} from 'former-kit'

import styles from '../style.css'

import required from '../../../validation/required'
import isEmail from '../../../validation/email'

const isRequired = t => required(t('sign_up.required'))

const SignUpForm = ({
  base,
  errors,
  loading,
  onSubmit,
  t,
}) => (
  <Form
    errors={errors}
    validation={{
      company: isRequired(t),
      email: isEmail(t('invalid_email')),
      name: isRequired(t),
      password: isRequired(t),
    }}
    onSubmit={onSubmit}
  >
    <div className={styles.signIn}>
      <FormInput
        base={base}
        disabled={loading}
        label={t('sign_up.name')}
        name="name"
        type="text"
      />
      <FormInput
        base={base}
        disabled={loading}
        label={t('sign_up.company')}
        name="company"
        type="text"
      />
      <FormInput
        base={base}
        disabled={loading}
        label={t('email')}
        name="email"
        type="email"
      />
      <FormInput
        base={base}
        disabled={loading}
        label={t('password')}
        name="password"
        type="password"
      />
    </div>
    <div className={styles.actions}>
      <div className={styles.hugeButton} >
        <Button
          disabled={loading}
          type="submit"
          size="huge"
          fill="gradient"
        >
          {t('sign_up.sign_up_action')}
        </Button>
      </div>
    </div>
  </Form>
)

SignUpForm.defaultProps = {
  errors: null,
  loading: false,
  t: t => t,
}

SignUpForm.propTypes = {
  base: PropTypes.oneOf(['dark', 'light']).isRequired,
  errors: PropTypes.oneOfType([
    PropTypes.shape({
      company: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
      password: PropTypes.string,
    }),
    PropTypes.instanceOf(Error),
  ]),
  loading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  t: PropTypes.func,
}

export default SignUpForm
