import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
  Button,
  Spacing,
} from 'former-kit'

import IconGithub from 'emblematic-icons/svg/Github20.svg'
import IconTest from 'emblematic-icons/svg/TestAmbientOn24.svg'
import IconBack from 'emblematic-icons/svg/ChevronBack32.svg'

import styles from './style.css'

const PresentationContainer = ({
  environmentUrl,
  environment,
  onRegister,
  t,
}) => (
  <div className={styles.secondaryContent}>
    <div>
      <h1 className={styles.title}>
        {t('landing.title')}
      </h1>
      <span className={styles.uppercase}>
        {t(`landing.${environment}.subtitle`)}

        {environment === 'test' &&
          <Fragment>
            &nbsp;
            <strong>{t('landing.test.subtitle_emphasis')}</strong>
            &nbsp;
            {t('landing.test.subtitle_company')}
          </Fragment>
        }
      </span>
    </div>
    <div>
      <p className={styles.paragraph}>
        {t(`landing.${environment}.about_dashboard`)}
      </p>
      {environment === 'test' &&
        <p className={styles.paragraph}>
          {t('landing.test.sandbox_disclaimer')}
        </p>
      }
    </div>
    <div className={classNames(styles.uppercase, styles.signInBlock)}>
      <p>
        <span>{t('landing.login_call')}</span>
        <span>
          {t('landing.signup_call')}
          &nbsp;
          <button
            className={styles.link}
            onClick={onRegister}
            role="link"
          >
            {t('landing.signup_action')}
          </button>
        </span>
      </p>
    </div>
    <div className={styles.changeEnvironment}>
      {environment === 'live' &&
        <div>
          <a
            href={environmentUrl}
            className={classNames(styles.goToTest, styles.uppercase)}
          >
            <IconTest height={60} width={60} />
            <Spacing size="small" />
            {t('landing.live.back_link')}
            &nbsp;
            <strong>
              {t('landing.live.back_link_emphasis')}
            </strong>
          </a>
        </div>
      }

      {environment === 'test' &&
        <div>
          <a href={environmentUrl} className={styles.link}>
            <Button
              fill="outline"
              icon={<IconBack width={16} height={16} />}
            >
              {t('landing.test.back_button')}
            </Button>
          </a>
        </div>
      }

      <div>
        <a href="https://github.com/pagarme/pilot" className={styles.githubLink}>
          <IconGithub height={24} width={21} />
        </a>
      </div>
    </div>
  </div>
)

PresentationContainer.propTypes = {
  environmentUrl: PropTypes.string.isRequired,
  environment: PropTypes.oneOf(['live', 'test']).isRequired,
  onRegister: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

export default PresentationContainer
