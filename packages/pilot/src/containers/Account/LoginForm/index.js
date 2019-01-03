import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-vanilla-form'
import IconError from 'emblematic-icons/svg/ClearClose32.svg'
import {
  Button,
  FormInput,
  Alert,
} from 'former-kit'

import styles from '../style.css'

const LoginContainer = ({
  base,
  errors,
  loading,
  onLogin,
  onPasswordRecovery,
  t,
}) => (
  <Form
    errors={errors}
    customErrorProp="error"
    onSubmit={onLogin}
  >
    <div className={styles.login}>
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
        type="password"
        label={t('password')}
        name="password"
      />
    </div>
    <div className={styles.errorAlert}>
      {errors &&
        <Alert
          base={base}
          type="error"
          icon={<IconError height={16} width={16} />}
        >
          <span>
            {errors.null
              ? errors.null
              : t('login.network_error')
            }
          </span>
        </Alert>
      }
    </div>

    <div className={styles.actions}>
      <div className={styles.hugeButton}>
        <Button
          type="submit"
          disabled={loading}
          size="huge"
          fill="gradient"
        >
          {t('login.login_action')}
        </Button>
      </div>
      <button
        role="link"
        disabled={loading}
        onClick={onPasswordRecovery}
      >
        {t('login.password_recovery_action')}
      </button>
    </div>
  </Form>
)

LoginContainer.propTypes = {
  base: PropTypes.oneOf(['dark', 'light']).isRequired,
  errors: PropTypes.oneOfType([
    PropTypes.shape({
      email: PropTypes.string,
      password: PropTypes.string,
    }),
    PropTypes.instanceOf(Error),
  ]),
  loading: PropTypes.bool,
  onLogin: PropTypes.func.isRequired,
  onPasswordRecovery: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

LoginContainer.defaultProps = {
  errors: null,
  loading: false,
}

export default LoginContainer
