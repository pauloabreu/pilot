import React from 'react'
import { action } from '@storybook/addon-actions'

import Capture from '../../../src/containers/Capture'

const commonProps = {
  captureAmount: '2000',
  isFromCheckout: false,
  isOpen: true,
  onCancel: action('onCancel'),
  onChange: action('onChange'),
  onConfirm: action('onConfirm'),
  onRetry: action('onRetry'),
  onViewTransaction: action('viewTransaction'),
  t: string => string,
  transaction: {
    capabilities: {
      capturable: true,
    },
    card: {
      brand_name: 'Mastercard',
      first_digits: '4111',
      last_digits: '1111',
    },
    payment: {
      authorized_amount: 2000,
      installments: 1,
      paid_amount: 0,
    },
    customer: {
      name: 'John Doe',
      email: 'johndoe@email.com',
    },
  },
}

export default props => <Capture {...commonProps} {...props} />
