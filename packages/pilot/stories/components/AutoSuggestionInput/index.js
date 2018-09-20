import React, { Fragment } from 'react'
import { action } from '@storybook/addon-actions'

import Section from '../../Section'
import SuggestionInput from '../../../src/components/SuggestionInput'

const data = [
  { name: 'Coffee', value: 'coffee' },
  { name: 'Tea', value: 'tea' },
  { name: 'Frapuccino', value: 'frapuccino' },
  { name: 'Milk Shake', value: 'milkshake' },
  { name: 'Coke', value: 'coke' },
  { name: 'Coke Light', value: 'coke-light' },
]

const AutoSuggestion = () => (
  <Fragment>
    <Section title="Auto Suggestion Input">
      <SuggestionInput
        data={data}
        onChange={action('change')}
        placeholder="type to search..."
      />
    </Section>
  </Fragment>
)

export default AutoSuggestion
