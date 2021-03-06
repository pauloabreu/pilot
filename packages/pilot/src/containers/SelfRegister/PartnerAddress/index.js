import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Col,
  FormDropdown,
  FormInput,
  Grid,
  Row,
} from 'former-kit'
import Form from 'react-vanilla-form'

import cepValidation from '../../../validation/cep'
import { handleMaskField, onFormMaskFieldChange } from '../formMaskFieldHelpers'
import HeaderImage from '../../../components/SelfRegister/HeaderImage'
import { Message } from '../../../components/Message'
import optionsStates from '../states.json'
import requiredValidation from '../../../validation/required'
import style from '../style.css'

const step = 'partner-address'

const isCep = t => cepValidation(t('validations.isCep'))
const isRequired = t => requiredValidation(t('pages.self_register.required_error'))

class SelfRegisterPartnerAddress extends Component {
  constructor (props) {
    super(props)

    this.state = {
      formData: {
        ...props.registerData,
      },
    }

    this.handleMaskField = handleMaskField.bind(this)
    this.onFormMaskFieldChange = onFormMaskFieldChange.bind(this)
  }

  render () {
    const { onSubmit, t } = this.props

    return (
      <Fragment>
        <Message
          image={<HeaderImage step={step} />}
          title={
            <p className={style.headerTitle}>
              {t('pages.self_register.partner_address.form_title')}
            </p>
        }
        />

        <Form
          className={style.fillWidth}
          data={{
            ...this.state.formData,
          }}
          onChange={this.onFormMaskFieldChange}
          onSubmit={onSubmit}
          validateOn="blur"
          validation={{
            cep: [isRequired(t), isCep(t)],
            city: isRequired(t),
            neighborhood: isRequired(t),
            number: isRequired(t),
            state: isRequired(t),
            street: isRequired(t),
          }}
        >
          <Grid>
            <Row>
              <Col tv={4} desk={4} tablet={4} palm={12}>
                <FormInput
                  label={t('pages.self_register.partner_address.cep')}
                  mask="11111-111"
                  name="cep"
                  onChange={this.handleMaskField('cep')}
                />
              </Col>
            </Row>

            <Row>
              <Col tv={8} desk={8} tablet={8} palm={12}>
                <FormInput
                  label={t('pages.self_register.partner_address.street')}
                  name="street"
                />
              </Col>
              <Col tv={4} desk={4} tablet={4} palm={12}>
                <FormInput
                  label={t('pages.self_register.partner_address.number')}
                  name="number"
                />
              </Col>
            </Row>

            <Row>
              <Col tv={8} desk={8} tablet={8} palm={12}>
                <FormInput
                  label={t('pages.self_register.partner_address.complement')}
                  name="complement"
                />
              </Col>
              <Col tv={4} desk={4} tablet={4} palm={12}>
                <FormInput
                  label={t('pages.self_register.partner_address.neighborhood')}
                  name="neighborhood"
                />
              </Col>
            </Row>

            <Row>
              <Col tv={8} desk={8} tablet={8} palm={12}>
                <FormInput
                  label={t('pages.self_register.partner_address.city')}
                  name="city"
                />
              </Col>
              <Col tv={4} desk={4} tablet={4} palm={12}>
                <FormDropdown
                  name="state"
                  options={optionsStates}
                  placeholder={t('pages.self_register.partner_address.state')}
                />
              </Col>
            </Row>

            <span className={style.buttonSubmit}>
              <Button type="submit" size="huge" fill="gradient">
                {t('pages.self_register.partner_address.continue')}
              </Button>
            </span>
          </Grid>
        </Form>
      </Fragment>
    )
  }
}

SelfRegisterPartnerAddress.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  registerData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

SelfRegisterPartnerAddress.defaultProps = {
  registerData: {},
}

export default SelfRegisterPartnerAddress
