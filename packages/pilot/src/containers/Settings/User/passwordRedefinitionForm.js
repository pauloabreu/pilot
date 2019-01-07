import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-vanilla-form'
import { validate } from 'p4g4rm3'
import {
  Alert,
  Button,
  CardActions,
  CardContent,
  Col,
  FormInput,
  Grid,
  Row,
} from 'former-kit'
import {
  always,
  equals,
  F,
  ifElse,
  pathOr,
} from 'ramda'
import IconWarning from 'emblematic-icons/svg/Warning32.svg'
import IconInfo from 'emblematic-icons/svg/Info32.svg'

import PasswordInput from '../../../components/PasswordInput'

const required = t => value => (value ? null : t('pages.settings.user.card.access.field_required'))
const equalsString = (t, str1) => ifElse(
  equals(str1),
  F,
  always(t('pages.settings.user.card.access.password_equal'))
)

const initialFormData = {
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
}

class PasswordRedefinitionForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      initialFormData,
      currentFormData: initialFormData,
      saveActionDisabled: true,
      showPopover: false,
      validations: validate(initialFormData.new_password),
    }

    this.handleCancellation = this.handleCancellation.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handlePasswordBlur = this.handlePasswordBlur.bind(this)
    this.handlePasswordFocus = this.handlePasswordFocus.bind(this)
  }

  // @TODO: Precisa refatorar isso aqui, porque este método está obsoleto.
  componentWillReceiveProps (nextProps) {
    const { status: { success } } = nextProps

    if (success) {
      this.setState({
        currentFormData: this.state.initialFormData,
      })
    }
  }

  handleFormChange (data) {
    const validations = validate(pathOr('', ['new_password'], data))
    const saveActionDisabled = (
      !validations.isValid ||
      !equals(data.new_password, data.new_password_confirmation)
    )

    this.setState({
      currentFormData: data,
      saveActionDisabled,
      validations,
    })
  }

  handleCancellation () {
    this.setState({
      currentFormData: {},
      saveActionDisabled: true,
      showPopover: false,
      validations: validate(initialFormData.new_password),
    })
  }

  handleFormSubmit (data, errors) {
    if (!errors) {
      this.props.onSubmit(data)
    }
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
    const {
      status,
      t,
    } = this.props

    const {
      currentFormData: {
        new_password: password,
      },
      saveActionDisabled,
      showPopover,
      validations,
    } = this.state

    return (
      <Form
        data={this.state.currentFormData}
        onSubmit={this.handleFormSubmit}
        onChange={this.handleFormChange}
        validation={{
          current_password: required(t),
          new_password: required(t),
          new_password_confirmation: [
            required(t),
            equalsString(t, password),
          ],
        }}
      >
        <CardContent>
          <Grid>
            <Row>
              <Col palm={12} tablet={12} desk={3} tv={3}>
                <FormInput
                  label={t('pages.settings.user.card.access.current_password')}
                  name="current_password"
                  type="password"
                />
              </Col>
              <Col palm={12} tablet={12} desk={3} tv={3}>
                <PasswordInput
                  label={t('pages.settings.user.card.access.new_password')}
                  name="new_password"
                  onBlur={this.handlePasswordBlur}
                  onFocus={this.handlePasswordFocus}
                  showPopover={showPopover}
                  t={t}
                  validations={validations}
                />
              </Col>
              <Col palm={12} tablet={12} desk={3} tv={3}>
                <FormInput
                  label={t('pages.settings.user.card.access.match_new_password')}
                  name="new_password_confirmation"
                  type="password"
                />
              </Col>
            </Row>
            <Row>
              <Col palm={12} tablet={12} desk={12} tv={12}>
                {status.error &&
                  <Alert
                    type="error"
                    icon={<IconWarning height={16} width={16} />}
                  >
                    <p>{status.error}</p>
                  </Alert>
                }
                {status.success &&
                  <Alert
                    type="info"
                    icon={<IconInfo height={16} width={16} />}
                  >
                    <p>{t('pages.settings.user.card.access.alert.success')}</p>
                  </Alert>
                }
              </Col>
            </Row>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            type="reset"
            fill="outline"
            size="default"
            onClick={this.handleCancellation}
          >
            {t('pages.settings.user.card.access.button_cancel')}
          </Button>
          <Button
            disabled={saveActionDisabled}
            type="submit"
            size="default"
            fill="gradient"
          >
            {t('pages.settings.user.card.access.button_submit')}
          </Button>
        </CardActions>
      </Form>
    )
  }
}

PasswordRedefinitionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  status: PropTypes.shape({
    error: PropTypes.string,
    success: PropTypes.bool,
  }).isRequired,
  t: PropTypes.func,
}

PasswordRedefinitionForm.defaultProps = {
  t: t => t,
}

export default PasswordRedefinitionForm
