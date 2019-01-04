import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { contains } from 'ramda'

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

const renderPopoverContent = (t, validations) => {
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

const PasswordInput = ({
  label,
  onBlur,
  onChange,
  onFocus,
  placement,
  showPopover,
  validations,
  value,
  t,
}) => (
  <div className={style.container}>
    <Popover
      content={renderPopoverContent(t, validations)}
      closeWhenClickOutside={false}
      onClick={onFocus}
      placement={placement}
      visible={showPopover}
    >
      <FormInput
        label={label}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        type="password"
        value={value}
      />
    </Popover>
  </div>
)

PasswordInput.propTypes = {
  label: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  placement: PropTypes.string,
  showPopover: PropTypes.bool,
  validations: PropTypes.shape({
    errors: PropTypes.array,
    isValid: PropTypes.bool,
    score: PropTypes.oneOf([
      0, 1, 2, 3, 4,
    ]),
  }),
  value: PropTypes.string,
  t: PropTypes.func.isRequired,
}

PasswordInput.defaultProps = {
  onFocus: null,
  onChange: null,
  placement: 'bottomCenter',
  showPopover: false,
  validations: {
    errors: [],
  },
  value: '',
}

export default PasswordInput
