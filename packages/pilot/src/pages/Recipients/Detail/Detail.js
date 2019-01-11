import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'former-kit'
import { translate } from 'react-i18next'
import withRouter from 'react-router-dom/withRouter'
import { connect } from 'react-redux'
import { compose } from 'ramda'
import moment from 'moment'

import DetailRecipient from '../../../../src/containers/RecipientDetails'

const mockBalance = {
  onAnticipationClick: () => {
    console.log('onAnticipationClick')
  },
  onCancel: () => {
    console.log('onCancel')
  },
  onCancelRequestClick: () => {
    console.log('onCancelRequestClick')
  },
  onPageChange: () => {
    console.log('onPageChange')
  },
  onSave: () => {
    console.log('onSave')
  },
  onWithdrawClick: () => {
    console.log('onWithdrawClick')
  },
}

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
        // TODO: Change back to default 1 month period
        start: moment('2017-01-01'),
        end: moment('2019-01-01'),
      },
      total: {
        net: 0,
        outcoming: 0,
        outgoing: 0,
      },
      error: false,
      loading: true,
    }

    this.fetchAccounts = this.fetchAccounts.bind(this)
    this.fetchBalance = this.fetchBalance.bind(this)
    this.fetchRecipientData = this.fetchRecipientData.bind(this)
    this.fetchAnticipationLimit = this.fetchAnticipationLimit.bind(this)
    this.fetchBalanceTotal = this.fetchBalanceTotal.bind(this)
    this.onDateFilter = this.onDateFilter.bind(this)
    this.onSaveAnticipation = this.onSaveAnticipation.bind(this)
    this.onSaveTransfer = this.onSaveTransfer.bind(this)
    this.onSaveBankAccount = this.onSaveBankAccount.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  componentWillMount () {
    const { dates, currentPage } = this.state

    const limitPromise = this.fetchAnticipationLimit()
    const dataPromise = this.fetchRecipientData()
    const balancePromise = this.fetchBalance(dates, currentPage)
    const balanceTotalPromise = this.fetchBalanceTotal(dates)

    const fetchPromises = [
      dataPromise,
      limitPromise,
      balancePromise,
      balanceTotalPromise,
    ]

    Promise.all(fetchPromises)
      .then(([recipientData, anticipationLimit, balance, total]) => {
        this.setState({
          ...this.state,
          anticipationLimit,
          loading: false,
          recipientData,
          balance,
          total,
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

  onDateFilter (dates) {
    const firstPage = 1
    this.fetchBalance(dates, firstPage)
      .then((balance) => {
        this.setState({
          balance,
          dates,
          currentPage: firstPage,
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

  fetchBalance (dates, page) {
    const { client } = this.props
    const { id } = this.props.match.params
    const query = { dates, page }

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
      currentPage,
      dates,
      error,
      loading,
      recipientData,
      total,
    } = this.state

    if (loading) {
      // TODO: Mensagem de loading
      console.log('Loading...')
      return null
    }

    if (error) {
      // TODO: Mensagem de erro
      console.error('Erro durante fetch:')
      console.error(error)
      return null
    }

    const anticipation = {
      available: anticipationLimit,
      error,
      loading,
    }

    return (
      <Card>
        <DetailRecipient
          informationProps={recipientData.informationData}
          balanceProps={{
            ...mockBalance,
            ...balance,
            anticipation,
            currentPage,
            dates,
            disabled: loading,
            total,
            onFilterClick: this.onDateFilter,
          }}
          configurationProps={{
            ...recipientData.configurationData,
            onSaveAnticipation: this.onSaveAnticipation,
            onSaveTransfer: this.onSaveTransfer,
            onSaveBankAccount: this.onSaveBankAccount,
            onCancel: this.onCancel,
          }}
          recipient={recipientData.companyData}
          t={this.props.t}
        />
      </Card>
    )
  }
}

DetailRecipientPage.propTypes = {
  client: PropTypes.shape({
    recipient: PropTypes.shape({
      add: PropTypes.func.isRequired,
      bankAccount: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
}

export default enhanced(DetailRecipientPage)
