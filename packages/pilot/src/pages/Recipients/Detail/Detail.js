import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'former-kit'
import { translate } from 'react-i18next'
import withRouter from 'react-router-dom/withRouter'
import { connect } from 'react-redux'
import { compose } from 'ramda'

import moment from 'moment'
import mock from '../../../../src/containers/Balance/mock.json'

import DetailRecipient from '../../../../src/containers/RecipientDetails'

const mockBalance = {
  anticipation: {
    available: 10000,
    error: false,
    loading: false,
  },
  dates: {
    end: moment().add(1, 'month'),
    start: moment(),
  },
  ...mock.result,
  query: {
    dates: {
      end: moment().add(1, 'month'),
      start: moment(),
    },
    page: 1,
  },
  total: {
    net: 1000000,
    outcoming: 1000000,
    outgoing: 1000000,
  },
  currentPage: 1,
  disabled: false,
  onAnticipationClick: () => {},
  onCancel: () => {},
  onCancelRequestClick: () => {},
  onFilterClick: () => {},
  onPageChange: () => {},
  onSave: () => {},
  onWithdrawClick: () => {},
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
      anticipation: {
        available: 0,
        error: false,
        loading: true,
      },
      error: false,
      loading: true,
    }

    this.fetchAccounts = this.fetchAccounts.bind(this)
    this.fetchRecipientData = this.fetchRecipientData.bind(this)
    this.onSaveAnticipation = this.onSaveAnticipation.bind(this)
    this.onSaveTransfer = this.onSaveTransfer.bind(this)
    this.onSaveBankAccount = this.onSaveBankAccount.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  componentWillMount () {
    this.fetchRecipientData()
      .then((recipientData) => {
        this.setState({
          ...this.state,
          loading: false,
          recipientData,
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

  render () {
    const {
      anticipation,
      error,
      loading,
      recipientData,
    } = this.state

    if (loading || error) return null

    return (
      <Card>
        <DetailRecipient
          informationProps={recipientData.informationData}
          balanceProps={{
            anticipation,
            ...mockBalance,
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
