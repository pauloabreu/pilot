import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Card,
  CardContent,
  Col,
  Grid,
  Row,
} from 'former-kit'
import ArrowBack from 'emblematic-icons/svg/ChevronBack24.svg'
import classNames from 'classnames'

import Logo from '../../pages/logo.svg'
import SelfRegisterForm from './form'
import style from './style.css'

const SelfRegister = ({
  onPreviousButton,
  onRedirectToHome,
  onSubmit,
  step,
  t,
}) => (
  <div className={style.fullScreen}>
    <Grid className={style.blankCard}>
      <Row className={style.contentRow}>
        <Col tv={12} desk={12} tablet={12} palm={12} className={style.columnPadding}>
          <Card className={style.stretchVertically}>
            <CardContent className={style.stretchVertically}>
              <Grid fullHeight>
                <Row className={style.stretchVertically}>
                  <Col tv={3} desk={3} tablet={3} palm={3}>
                    <div className={style.header}>
                      <Button
                        fill="outline"
                        icon={<ArrowBack height={12} width={12} />}
                        onClick={onPreviousButton}
                        size="tiny"
                        type="submit"
                      >
                        {t('pages.self_register.return')}
                      </Button>
                    </div>
                  </Col>

                  <Col
                    align="center"
                    className={classNames(style.stretchVertically, style.noPaddingBottom)}
                    desk={6}
                    palm={6}
                    tablet={6}
                    tv={6}
                  >
                    <Logo className={style.logo} width={140} />

                    <div className={classNames(style.growContent, style.centerContent)}>
                      <SelfRegisterForm
                        onRedirectToHome={onRedirectToHome}
                        onSubmit={onSubmit}
                        step={step}
                        t={t}
                      />
                    </div>
                  </Col>

                  <Col tv={3} desk={3} tablet={3} palm={3} />
                </Row>
              </Grid>
            </CardContent>
          </Card>
        </Col>
      </Row>
    </Grid>
  </div>
)

SelfRegister.propTypes = {
  onPreviousButton: PropTypes.func.isRequired,
  onRedirectToHome: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  step: PropTypes.oneOf([
    'create-account',
    'check-cnpj',
    'type-cnpj',
  ]),
  t: PropTypes.func.isRequired,
}

SelfRegister.defaultProps = {
  step: 'create-account',
}

export default SelfRegister
