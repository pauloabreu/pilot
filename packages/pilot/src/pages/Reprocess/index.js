import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import copyToClipBoard from 'clipboard-copy'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { withRouter } from 'react-router-dom'
import {
  compose,
  either,
  isEmpty,
  isNil,
} from 'ramda'

import ReprocessContainer from '../../containers/Reprocess'
import { getResponseErrorMessage } from '../../formatters/apiError'

const mapStateToProps = ({
  account: { client },
}) => ({ client })

const enhanced = compose(
  translate(),
  connect(mapStateToProps, null),
  withRouter
)

const isEmptyOrNull = either(isEmpty, isNil)

const reprocessStepStatuses = {
  confirmation: {
    confirmation: 'current',
    result: 'pending',
  },
  confirmationError: {
    confirmation: 'error',
    result: 'pending',
  },
  result: {
    confirmation: 'success',
    result: 'current',
  },
  resultError: {
    confirmation: 'success',
    result: 'error',
  },
}

class Reprocess extends Component {
  constructor (props) {
    super(props)

    this.state = {
      error: null,
      loading: false,
      stepStatus: reprocessStepStatuses.confirmation,
      transaction: null,
    }
    this.handleClose = this.handleClose.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.handleCopyId = this.handleCopyId.bind(this)
    this.handleReprocessRestart = this.handleReprocessRestart.bind(this)
    this.handleViewTransaction = this.handleViewTransaction.bind(this)
    this.requestData = this.requestData.bind(this)
  }

  componentDidUpdate (prevProps) {
    const { isOpen } = this.props
    if (isOpen
      && prevProps.isOpen !== isOpen
      && isEmptyOrNull(this.state.transaction)) {
      this.requestData()
    }
  }

  requestData () {
    const {
      client,
      transactionId,
    } = this.props
    this.setState({
      error: null,
      loading: true,
    })

    client.transactions
      .details(transactionId)
      .then(({ transaction }) => {
        this.setState({
          loading: false,
          transaction,
        })
      })
      .catch((error) => {
        this.setState({
          error,
          loading: false,
          stepStatus: reprocessStepStatuses.confirmationError,
        })
      })
  }

  handleClose () {
    const { onClose } = this.props
    if (this.state.stepStatus.result !== 'error') {
      onClose(this.state.newTransactionId)
    } else {
      onClose()
    }
  }

  handleConfirm () {
    const {
      client,
      transactionId,
    } = this.props

    this.setState({
      error: null,
      loading: true,
    })

    return client.transactions
      .reprocess(transactionId)
      .then((transaction) => {
        this.setState({
          loading: false,
          stepStatus: reprocessStepStatuses.result,
          newTransactionId: transaction.id,
        })
      })
      .catch((error) => {
        this.setState({
          error,
          loading: false,
          stepStatus: reprocessStepStatuses.resultError,
        })
      })
  }

  handleCopyId () {
    const { transactionId } = this.props
    const id = this.state.newTransactionId || transactionId

    copyToClipBoard(id)
  }

  handleReprocessRestart () {
    this.setState({
      error: null,
      loading: false,
      stepStatus: reprocessStepStatuses.confirmation,
    })
  }

  handleViewTransaction () {
    const {
      history,
      onClose,
    } = this.props

    history.push(`/transactions/${this.state.newTransactionId}`)
    onClose()
  }

  render () {
    const {
      isOpen,
      t,
    } = this.props
    const {
      error,
      loading,
      stepStatus,
      transaction,
    } = this.state

    const statusMessage = error
      ? getResponseErrorMessage(error)
      : t('pages.reprocess.success')

    return (
      <Fragment>
        {!isNil(transaction) &&
          <ReprocessContainer
            isOpen={isOpen}
            loading={loading}
            onCancel={this.handleClose}
            onConfirm={this.handleConfirm}
            onCopyId={this.handleCopyId}
            onRestart={this.handleReprocessRestart}
            onViewTransaction={this.handleViewTransaction}
            statusMessage={statusMessage}
            stepStatus={stepStatus}
            t={t}
            transaction={transaction}
          />
        }
      </Fragment>
    )
  }
}

Reprocess.propTypes = {
  client: PropTypes.shape({
    transactions: PropTypes.shape({
      details: PropTypes.func.isRequired,
      reprocess: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  transactionId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
}

export default enhanced(Reprocess)
