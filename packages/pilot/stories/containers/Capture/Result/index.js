import React from 'react'
import { action } from '@storybook/addon-actions'

import ErrorIcon from '../../../../src/components/TransferError/ErrorIcon.svg'
import Result from '../../../../src/containers/Capture/Result'

const CaptureResult = () => (
  <Result
    authorizedAmount={1000}
    cardBrand="Mastercard"
    cardFirstDigits="41414"
    cardLastDigits="4141"
    customerName="John Doe"
    customerEmail="johndoe@pagar.me"
    image={<ErrorIcon />}
    installments={1}
    message="Transação capturada com sucesso!"
    onRetry={action('onRetry')}
    onViewTransaction={action('onViewTransaction')}
    paidAmount={1000}
    status="current"
    t={t => t}
  />
)

export default CaptureResult
