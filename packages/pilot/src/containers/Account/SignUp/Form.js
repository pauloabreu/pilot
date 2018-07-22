import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-vanilla-form'
import {
  Button,
  FormInput,
} from 'former-kit'

import styles from '../style.css'

import required from '../../../validation/required'

const isRequired = t => required(t('sign_up.required'))

const SignUpForm = ({
  errors,
  loading,
  onSubmit,
  t,
}) => (
  <Form
    data={{
      email: '',
      name: '',
      company: '',
      password: '',
    }}
    errors={errors}
    validation={{
      company: isRequired(t),
      email: isRequired(t),
      name: isRequired(t),
      password: isRequired(t),
    }}
    onSubmit={onSubmit}
  >
    <div className={styles.signIn}>
      <FormInput
        disabled={loading}
        label={t('sign_up.name')}
        name="name"
        type="text"
      />
      <FormInput
        disabled={loading}
        label={t('sign_up.company')}
        name="company"
        type="text"
      />
      <FormInput
        disabled={loading}
        label={t('email')}
        name="email"
        type="email"
      />
      <FormInput
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
