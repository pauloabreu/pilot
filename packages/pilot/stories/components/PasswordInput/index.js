import React from 'react'
import { action } from '@storybook/addon-actions'

import Section from '../../Section'
import PasswordInput from '../../../src/components/PasswordInput'

const PasswordStory = () => (
  <Section title="Password Input">
    <PasswordInput
      label="Password"
      onChange={action('changed')}
      value="this is a super password"
      t={t => t}
    />
  </Section>
)

export default PasswordStory
