import React, { Component } from 'react'
import { action } from '@storybook/addon-actions'
import { validate } from 'p4g4rm3'

import Section from '../../Section'
import PasswordInput from '../../../src/components/PasswordInput'

const initialPassword = 'this is a super password'

const actionChangePassword = action('password changed')

class PasswordStory extends Component {
  constructor () {
    super()

    this.state = {
      password: initialPassword,
      showPopover: false,
      validations: validate(initialPassword),
    }

    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange ({ target: { value } }) {
    this.setState({
      password: value,
      validations: validate(value),
    }, () => actionChangePassword(this.state.password))
  }

  handleFocus () {
    this.setState({
      showPopover: true,
    })
  }

  handleBlur () {
    const {
      validations: {
        isValid,
        score,
      },
    } = this.state

    if (isValid && score > 1) {
      this.setState({
        showPopover: false,
      })
    }
  }

  render () {
    const {
      password,
      showPopover,
      validations,
    } = this.state

    return (
      <Section title="Password Input">
        <PasswordInput
          label="Password"
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          showPopover={showPopover}
          validations={validations}
          value={password}
          t={t => t}
        />
      </Section>
    )
  }
}

export default PasswordStory
