import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { withRouter } from 'react-router-dom'
import {
  always,
  clone,
  compose,
  equals,
  head,
  identity,
  ifElse,
  isEmpty,
  merge,
  pipe,
  prop,
} from 'ramda'

import {
  receiveRefund,
  requestRefund,
} from './actions'
import RefundContainer from '../../containers/Refund'

const mapStateToProps = ({
  account: { client },
}) => ({ client })

const mapDispatchToProps = {
  onReceiveRefund: receiveRefund,
  onRequestRefund: requestRefund,
}

const identification = 'identification'
const confirmation = 'confirmation'
const result = 'result'

const enhanced = compose(
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)

const getPreviousStep = ifElse(
  equals(confirmation),
  always(identification),
  always(confirmation)
)

const getErrorMessage = pipe(
  prop('errors'),
  head,
  prop('message'),
  ifElse(
    isEmpty,
    always(null),
    identity
  )
)

const defaultState = {
  currentStep: identification,
  loading: false,
  statusMessage: '',
  stepsStatus: {
    [identification]: 'current',
    [confirmation]: 'pending',
    [result]: 'pending',
  },
}


class Refund extends Component {
  constructor (props) {
    super(props)

    this.state = clone(defaultState)

    this.handleBack = this.handleBack.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.handleConfirmationStep = this.handleConfirmationStep.bind(this)
    this.handleStepBackward = this.handleStepBackward.bind(this)
  }

  handleClose () {
    const {
      onClose,
      onSuccess,
      transaction: {
        id,
      },
    } = this.props
    const { stepsStatus } = this.state

    if (stepsStatus.confirmation === 'success') {
      onSuccess(id)
    }
    onClose()
  }

  handleBack () {
    const { currentStep } = this.state

    switch (currentStep) {
      case confirmation: {
        this.handleStepBackward()
        break
      }

      case result: {
        this.setState(clone(defaultState))
        break
      }

      default: {
        break
      }
    }
  }

  handleConfirm (data) {
    const {
      currentStep,
      stepsStatus,
    } = this.state

    switch (currentStep) {
      case identification: {
        this.setState({
          currentStep: confirmation,
          stepsStatus: merge(
            stepsStatus,
            {
              [identification]: 'success',
              [confirmation]: 'current',
            }
          ),
        })
        break
      }

      case confirmation: {
        this.handleConfirmationStep(data)
        break
      }

      case result: {
        this.handleClose()
        break
      }

      default: {
        break
      }
    }
  }

  handleStepBackward () {
    const {
      currentStep,
      stepsStatus,
    } = this.state

    const previousStep = getPreviousStep(currentStep)

    this.setState({
      currentStep: previousStep,
      stepsStatus: merge(
        stepsStatus,
        {
          [currentStep]: 'pending',
          [previousStep]: 'current',
        }
      ),
    })
  }

  handleConfirmationStep (data) {
    const {
      client,
      onRequestRefund,
      onReceiveRefund,
      t,
      transaction: {
        id,
      },
    } = this.props

    const {
      stepsStatus,
    } = this.state

    const body = merge(
      data,
      { id }
    )

    this.setState({
      loading: true,
    })

    onRequestRefund()

    client.transactions
      .refund(body)
      .then(() => {
        this.setState({
          statusMessage: t('pages.refund.success_message'),
          currentStep: result,
          loading: false,
          stepsStatus: merge(
            stepsStatus,
            {
              [confirmation]: 'success',
              [result]: 'success',
            }
          ),
        })
        onReceiveRefund()
      })
      .catch((error) => {
        this.setState({
          statusMessage: getErrorMessage(error.response),
          loading: false,
          currentStep: result,
          stepsStatus: merge(
            stepsStatus,
            {
              [confirmation]: 'success',
              [result]: 'error',
            }
          ),
        })
        onReceiveRefund(error)
      })
  }

  render () {
    const {
      isOpen,
      t,
      transaction,
    } = this.props
    const {
      currentStep,
      loading,
      statusMessage,
      stepsStatus,
    } = this.state

    return (
      <Fragment>
        {!isEmpty(transaction) &&
          <RefundContainer
            currentStep={currentStep}
            isOpen={isOpen}
            loading={loading}
            onBack={this.handleBack}
            onClose={this.handleClose}
            onConfirm={this.handleConfirm}
            statusMessage={statusMessage}
            stepsStatus={stepsStatus}
            t={t}
            transaction={transaction}
          />
        }
      </Fragment>
    )
  }
}

Refund.propTypes = {
  client: PropTypes.shape({}).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onReceiveRefund: PropTypes.func.isRequired,
  onRequestRefund: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  transaction: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
}

export default enhanced(Refund)
