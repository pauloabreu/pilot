import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'former-kit'
import { translate } from 'react-i18next'
import withRouter from 'react-router-dom/withRouter'
import { connect } from 'react-redux'
import { compose, reject, propEq } from 'ramda'
import moment from 'moment'

import DetailRecipient from '../../../../src/containers/RecipientDetails'
import ConfirmModal from '../../../../src/components/ConfirmModal'
import ErrorAlert from '../../../../src/components/ErrorAlert'
import Loader from '../../../../src/components/Loader'

const mapStateToProps = (state) => {
  const { account } = state
  const { client } = account

  return {
    client,
  }
}

const enhanced = compose(
  connect(mapStateToProps),
  translate(),
  withRouter
)

class DetailRecipientPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      anticipationLimit: 0,
      currentPage: 1,
      dates: {
        end: moment(),
        start: moment().subtract(1, 'months'),
      },
      total: {
        net: 0,
        outcoming: 0,
        outgoing: 0,
      },
      error: false,
      loading: true,
      showModal: false,
      anticipationToCancel: null,
    }

    this.cancelAnticipation = this.cancelAnticipation.bind(this)
    this.changeBalancePage = this.changeBalancePage.bind(this)
    this.fetchAccounts = this.fetchAccounts.bind(this)
    this.fetchAnticipationLimit = this.fetchAnticipationLimit.bind(this)
    this.fetchBalanceData = this.fetchBalanceData.bind(this)
    this.fetchBalanceTotal = this.fetchBalanceTotal.bind(this)
    this.fetchRecipientData = this.fetchRecipientData.bind(this)
    this.filterBalanceByDate = this.filterBalanceByDate.bind(this)
    this.hideCancelAnticipationModal = this.hideCancelAnticipationModal.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSaveAnticipation = this.onSaveAnticipation.bind(this)
    this.onSaveBankAccount = this.onSaveBankAccount.bind(this)
    this.onSaveTransfer = this.onSaveTransfer.bind(this)
    this.sendToAnticipationPage = this.sendToAnticipationPage.bind(this)
    this.sendToWithdrawPage = this.sendToWithdrawPage.bind(this)
    this.showCancelAnticipationModal = this.showCancelAnticipationModal.bind(this)
  }

  componentWillMount () {
    const { dates, currentPage } = this.state

    const anticipationLimitPromise = this.fetchAnticipationLimit()
    const recipientDataPromise = this.fetchRecipientData()
    const balanceDataPromise = this.fetchBalanceData(dates, currentPage)
    const balanceTotalPromise = this.fetchBalanceTotal(dates)

    const fetchPromises = [
      recipientDataPromise,
      anticipationLimitPromise,
      balanceDataPromise,
      balanceTotalPromise,
    ]

    Promise.all(fetchPromises)
      .then(([
        recipientData,
        anticipationLimit,
        balanceData,
        balanceTotal,
      ]) => {
        const {
          balance,
          recipient,
          requests,
          search,
        } = balanceData

        this.setState({
          ...this.state,
          anticipationLimit,
          balance,
          balanceTotal,
          loading: false,
          recipient,
          recipientData,
          requests,
          search,
        })
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          error,
          loading: false,
        })
      })
  }

  onSaveAnticipation (getData) {
    const { client } = this.props
    const { id } = this.props.match.params
    return client.recipient.update(id, { configuration: getData })
      .then(() => {
        this.setState({
          ...this.state,
          recipientData: {
            ...this.state.recipientData,
            configurationData: {
              ...this.state.recipientData.configurationData,
              anticipation: {
                ...this.state.recipientData.configurationData.anticipation,
                ...getData,
              },
            },
          },
        })
      })
  }

  onSaveTransfer (getData) {
    const { client } = this.props
    const { id } = this.props.match.params

    return client.recipient.update(id, { configuration: getData })
      .then(() => {
        this.setState({
          ...this.state,
          recipientData: {
            ...this.state.recipientData,
            configurationData: {
              ...this.state.recipientData.configurationData,
              transfer: {
                ...this.state.recipientData.configurationData.transfer,
                ...getData,
              },
            },
          },
        })
      })
  }

  onSaveBankAccount (getData) {
    const { client } = this.props
    const { id } = this.props.match.params
    let operation = Promise.resolve()

    if (getData.id) {
      operation = client.recipient.update(id, { configuration: getData })
    } else if (getData.bank) {
      const { documentType } = this.state.recipientData.informationData.identification
      operation = client.recipient.createNewAccount({
        identification: {
          documentType,
          [documentType]: this.state.recipientData.informationData.identification[documentType],
        },
        bankAccount: getData,
      })
        .then((bankAccountCreated) => {
          const { accounts } = this.state.recipientData.configurationData
          this.setState({
            ...this.state,
            recipientData: {
              ...this.state.recipientData,
              configurationData: {
                ...this.state.recipientData.configurationData,
                accounts: [...accounts, bankAccountCreated],
              },
            },
          })

          return client.recipient.update(id, {
            configuration: {
              id: bankAccountCreated.id,
            },
          })
        })
    }

    return operation
      .then((data) => {
        this.setState({
          ...this.state,
          recipientData: {
            ...this.state.recipientData,
            configurationData: {
              ...this.state.recipientData.configurationData,
              bankAccount: data.bank_account,
            },
            companyData: {
              ...this.state.recipientData.companyData,
              name: data.bank_account.name,
            },
          },
        })
      })
  }

  onCancel () {
    this.setState({
      ...this.state,
    })
  }

  filterBalanceByDate (dates, page = 1) {
    this.fetchBalanceData(dates, page)
      .then((balanceData) => {
        const {
          balance,
          recipient,
          requests,
          search,
        } = balanceData

        this.setState({
          balance,
          currentPage: page,
          dates,
          recipient,
          requests,
          search,
        })
      })
  }

  sendToAnticipationPage () {
    const { history } = this.props
    const { id } = this.props.match.params
    history.push(`/anticipation/${id}`)
  }

  sendToWithdrawPage () {
    const { history } = this.props
    const { id } = this.props.match.params
    history.push(`/withdraw/${id}`)
  }

  changeBalancePage (page) {
    const { dates } = this.state
    return this.filterBalanceByDate(dates, page)
  }

  showCancelAnticipationModal (anticipationId) {
    return this.setState({
      showModal: true,
      anticipationToCancel: anticipationId,
    })
  }

  hideCancelAnticipationModal () {
    return this.setState({
      showModal: false,
      anticipationToCancel: null,
    })
  }

  cancelAnticipation () {
    return this.props.client.bulkAnticipations.cancel({
      recipientId: this.props.match.params.id,
      id: this.state.anticipationToCancel,
    })
      .then(({ id }) => {
        const removeCanceled = reject(propEq('id', id))
        const requests = removeCanceled(this.state.requests)
        this.setState({
          ...this.state,
          anticipationToCancel: null,
          requests,
          showModal: false,
        })
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          anticipationToCancel: null,
          error,
          showModal: false,
        })
      })
  }

  fetchAccounts (document) {
    return this.props.client.recipient.bankAccount(document)
  }

  fetchRecipientData () {
    const { client } = this.props
    const { id } = this.props.match.params

    let recipient

    return client.recipient.detail(id)
      .then((result) => {
        recipient = result
        const recipientIdentification = recipient.informationData.identification
        return this.fetchAccounts(recipientIdentification)
      })
      .then(accounts => ({
        ...recipient,
        configurationData: {
          ...recipient.configurationData,
          ...accounts,
        },
      }))
  }

  fetchAnticipationLimit () {
    const { client } = this.props
    const { id } = this.props.match.params
    return client.recipient.anticipationLimits(id)
      .then(limits => limits.maximum.amount)
  }

  fetchBalanceData (dates, page) {
    const { client } = this.props
    const { id } = this.props.match.params
    const query = { dates, page, count: 10 }

    return client.balance.data(id, query)
      .then(response => response.result)
  }

  fetchBalanceTotal (dates) {
    const { client } = this.props
    const { id } = this.props.match.params
    const query = { dates }
    return client.balance.total(id, query)
  }

  render () {
    const {
      anticipationLimit,
      balance,
      balanceTotal,
      currentPage,
      dates,
      error,
      loading,
      recipient,
      recipientData,
      requests,
      search,
      showModal,
    } = this.state

    const { t } = this.props

    if (loading) {
      return <Loader visible />
    }

    if (error) {
      return <ErrorAlert t={t} error={error} />
    }

    const anticipation = {
      available: anticipationLimit,
      error,
      loading,
    }

    const {
      informationData,
      configurationData,
      companyData,
    } = recipientData

    return (
      <Fragment>
        <Card>
          <DetailRecipient
            informationProps={informationData}
            balanceProps={{
              anticipation,
              balance,
              currentPage,
              dates,
              disabled: loading,
              onAnticipationClick: this.sendToAnticipationPage,
              onCancelRequestClick: this.showCancelAnticipationModal,
              onFilterClick: this.filterBalanceByDate,
              onPageChange: this.changeBalancePage,
              onWithdrawClick: this.sendToWithdrawPage,
              recipient,
              requests,
              search,
              total: balanceTotal,
            }}
            configurationProps={{
              ...configurationData,
              onSaveAnticipation: this.onSaveAnticipation,
              onSaveTransfer: this.onSaveTransfer,
              onSaveBankAccount: this.onSaveBankAccount,
              onCancel: this.onCancel,
            }}
            recipient={companyData}
            t={t}
          />
        </Card>
        <ConfirmModal
          cancelText={t('cancel_pending_request_cancel')}
          confirmText={t('cancel_pending_request_confirm')}
          isOpen={showModal}
          onCancel={this.hideCancelAnticipationModal}
          onConfirm={this.cancelAnticipation}
          title={t('cancel_pending_request_title')}
        >
          <div style={{ textAlign: 'center' }}>
            {t('cancel_pending_request_text')}
          </div>
        </ConfirmModal>
      </Fragment>
    )
  }
}

DetailRecipientPage.propTypes = {
  client: PropTypes.shape({
    recipient: PropTypes.shape({
      add: PropTypes.func.isRequired,
      bankAccount: PropTypes.func.isRequired,
    }).isRequired,
    bulkAnticipations: PropTypes.shape({
      cancel: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
}

export default enhanced(DetailRecipientPage)
