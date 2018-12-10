import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { contains } from 'ramda'
import { validate } from 'p4g4rm3'

import {
  FormInput,
  Popover,
  PopoverContent,
} from 'former-kit'

import style from './style.css'

const getStrengthClassnames = ({ score, isValid }) => classnames({
  [style.strong]: score === 4 && isValid,
  [style.moderated]: score === 3 && isValid,
  [style.weak]: score === 2 && isValid,
  [style.veryWeak]: score === 1 && isValid,
  [style.invalid]: !isValid,
})

class PasswordInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      popoverIsVisible: false,
      validations: validate(props.value),
      value: props.value,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleOpenPopover = this.handleOpenPopover.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    const { onChange } = this.props

    if ((prevState.value !== this.state.value) && onChange) {
      onChange(this.state.value)
    }
  }

  handleChange ({ target: { value } }) {
    this.setState({
      validations: validate(value),
      value,
    })
  }

  handleBlur () {
    const {
      validations: {
        isValid,
        score,
      },
    } = this.state

    if (isValid && score > 3) {
      this.setState({
        popoverIsVisible: false,
      })
    }
  }

  handleOpenPopover () {
    this.setState({
      popoverIsVisible: true,
    })
  }

  renderPopoverContent () {
    const { validations } = this.state
    const { t } = this.props

    const isValid = prop => ({
      [style.valid]: !contains(prop, validations.errors),
    })

    const minLengthRule = classnames(isValid('min_length'))

    const maxLengthRule = classnames(isValid('max_length'))

    return (
      <PopoverContent>
        <div className={style.info}>
          <strong>{ t('password_rules_title') }</strong>
          <span className={minLengthRule}>
            { t('password_rules_min_length', { length: 8 }) }
          </span>

          <span className={maxLengthRule}>
            { t('password_rules_max_length', { length: 64 }) }
          </span>

          <strong>{ t('password_strength') }</strong>
          <div className={style.strength}>
            <div className={getStrengthClassnames(validations)} />
          </div>
        </div>
      </PopoverContent>
    )
  }

  render () {
    const { popoverIsVisible, value } = this.state
    const { label, placement } = this.props

    return (
      <div className={style.container}>
        <Popover
          content={this.renderPopoverContent()}
          closeWhenClickOutside={false}
          onClick={this.handleOpenPopover}
          placement={placement}
          visible={popoverIsVisible}
        >
          <FormInput
            label={label}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            type="password"
            value={value}
          />
        </Popover>
      </div>
    )
  }
}

PasswordInput.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  placement: PropTypes.string,
  value: PropTypes.string,
  t: PropTypes.func.isRequired,
}

PasswordInput.defaultProps = {
  onChange: null,
  placement: 'bottomCenter',
  value: '',
}

export default PasswordInput
