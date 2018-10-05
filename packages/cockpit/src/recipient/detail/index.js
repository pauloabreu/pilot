import format from './format'
import {
  formatToAnticipation,
  formatToTransfer,
  formatToBankAccount,
} from '../add/formatToRecipient'

import formatBankAccount from '../account/formatBankAccount'

const DetailRecipient = client => recipientId => (
  client.recipients.find({ id: recipientId })
    .then(recipient => (format(recipient)))
)

const transform = recipient => ({
  ...recipient,
  bank_account: formatBankAccount([recipient.bank_account]).accounts[0],
})

const UpdateDetailRecipient = client => (recipientId, getData) => {
  const anticipationFormat = formatToAnticipation(getData)
  const transferFormat = formatToTransfer(getData)
  const bankAccountFormat = formatToBankAccount(getData)
  // if (getData.configuration.anticipationModel) {
  //   return client.recipients.update({
  //     id: recipientId,
  //     ...anticipationFormat,
  //   })
  // }
  // if (getData.configuration.transferInterval) {
  //   return client.recipients.update({
  //     id: recipientId,
  //     ...transferFormat,
  //   })
  // }
  // if (getData.configuration.id) {
  //   return client.recipients.update({
  //     id: recipientId,
  //     ...bankAccountFormat,
  //   })
  // }
  return client.recipients.update({
    id: recipientId,
    ...anticipationFormat,
    ...transferFormat,
    ...bankAccountFormat,
  })
    .then(transform)
  // return null
}

const AddNewBankAccount = client => (data) => {
  const newAccount = formatToBankAccount(data)
  return client.bankAccounts.create(newAccount.bank_account)
    .then(bankAccountCreated =>
      formatBankAccount([bankAccountCreated]).accounts[0])
}

export default {
  detail: DetailRecipient,
  update: UpdateDetailRecipient,
  createNewAccount: AddNewBankAccount,
}
