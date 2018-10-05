import { range } from 'ramda'

const getOnlyNumbers = string => string.replace(/\D/g, '')

export function formatToAnticipation (data, options = {}) {
  const recipientAnticipationData = {}
  const { canConfigureAnticipation } = options

  switch (data.configuration.anticipationModel) {
    case 'automatic_dx':
      recipientAnticipationData.anticipatable_volume_percentage = 100
      recipientAnticipationData.automatic_anticipation_enabled = true
      recipientAnticipationData.automatic_anticipation_days = range(1, 32)
      recipientAnticipationData.automatic_anticipation_1025_delay =
        data.configuration.anticipationDays

      if (canConfigureAnticipation) {
        recipientAnticipationData.automatic_anticipation_type = '1025'
      }
      break
    case 'automatic_volume':
      recipientAnticipationData.anticipatable_volume_percentage =
        data.configuration.anticipationVolumePercentage
      recipientAnticipationData.automatic_anticipation_enabled = true

      if (canConfigureAnticipation) {
        recipientAnticipationData.automatic_anticipation_type = 'full'
      }
      break
    case 'automatic_1025':
      recipientAnticipationData.anticipatable_volume_percentage = 100
      recipientAnticipationData.automatic_anticipation_enabled = true
      recipientAnticipationData.automatic_anticipation_days = [10, 25]
      recipientAnticipationData.automatic_anticipation_1025_delay = 15

      if (canConfigureAnticipation) {
        recipientAnticipationData.automatic_anticipation_type = '1025'
      }
      break
    case 'manual':
    default:
      recipientAnticipationData.anticipatable_volume_percentage =
        data.configuration.anticipationVolumePercentage ||
        data.anticipationVolumePercentage
      recipientAnticipationData.automatic_anticipation_enabled = false

      if (canConfigureAnticipation) {
        recipientAnticipationData.automatic_anticipation_type = 'full'
      }
      break
  }
  return recipientAnticipationData
}

export function formatToTransfer (data) {
  const recipientTransferData = {}

  // Transfer
  recipientTransferData.transfer_interval = data.configuration.transferInterval
  recipientTransferData.transfer_enabled = data.configuration.transferEnabled

  if (data.configuration.transferInterval === 'weekly') {
    const weekDayNumberMap = {
      monday: '1',
      tuesday: '2',
      wednesday: '3',
      thursday: '4',
      friday: '5',
    }
    const weekDay = data.configuration.transferWeekday
    const transferDay = weekDayNumberMap[weekDay]
    recipientTransferData.transfer_day = transferDay
  }

  if (data.configuration.transferInterval === 'daily') {
    recipientTransferData.transfer_day = '0'
  } else {
    recipientTransferData.transfer_day = data.configuration.transferDay
  }
  return recipientTransferData
}

export function formatToBankAccount (data) {
  const recipientBankAccountData = {}

  // Bank account
  if (data.bankAccount) {
    if (data.bankAccount.id) {
      recipientBankAccountData.bank_account_id = data.bankAccount.id
    } else {
      const { documentType } = data.identification
      const document = data.identification[documentType]
      recipientBankAccountData.bank_account = {
        bank_code: data.bankAccount.bank,
        agencia: data.bankAccount.agency,
        conta: data.bankAccount.number,
        conta_dv: data.bankAccount.number_digit,
        type: data.bankAccount.type,
        document_number: getOnlyNumbers(document),
        legal_name: data.bankAccount.name,
      }
      if (data.bankAccount.agency_digit) {
        recipientBankAccountData.agencia_dv = data.bankAccount.agency_digit
      }
    }
  }

  if (data.configuration) {
    if (data.configuration.id) {
      recipientBankAccountData.bank_account_id = data.configuration.id
    } else if (data.identification) {
      const { documentType } = data.identification
      const document = data.identification[documentType]

      recipientBankAccountData.bank_account = {
        bank_code: data.bankAccount.bank,
        agencia: data.bankAccount.agency,
        conta: data.bankAccount.number,
        conta_dv: data.bankAccount.number_digit,
        type: data.bankAccount.type,
        document_number: getOnlyNumbers(document),
        legal_name: data.bankAccount.name,
      }

      if (data.bankAccount.agency_digit) {
        recipientBankAccountData.agencia_dv = data.bankAccount.agency_digit
      }
    }
  }


  return recipientBankAccountData
}

function formatToRecipient (data, options) {
  const recipientData = {
    ...formatToAnticipation(data, options),
    ...formatToTransfer(data),
    ...formatToBankAccount(data),
  }
  const { documentType } = data.identification


  // Register
  const hasRegisterInformation = data
    .identification[`${documentType}Information`]

  if (hasRegisterInformation) {
    const phone = data.identification[`${documentType}Phone`]
    const phoneDigits = getOnlyNumbers(phone)
    const ddd = phoneDigits.slice(0, 2)
    const number = phoneDigits.slice(2)
    const url = data.identification[`${documentType}Url`]
    const email = data.identification[`${documentType}Email`]

    recipientData.register_information = {
      document_number: data.identification[documentType]
        .replace(/\D/g, ''),
      site_url: (url !== '')
        ? url
        : undefined,
      email,
    }

    if (phone !== '') {
      recipientData.register_information.phone_numbers = [{
        ddd,
        number,
        type: 'not defined',
      }]
    }

    const name = data.identification[`${documentType}Name`]

    if (documentType === 'cpf') {
      recipientData.register_information.type = 'individual'
      recipientData.register_information.name = name
    }

    if (documentType === 'cnpj') {
      recipientData.register_information.type = 'corporation'
      recipientData.register_information.company_name = name
    }

    const partnerNumber = parseInt(data.identification.partnerNumber, 10)

    if (partnerNumber > 0) {
      const partners = range(0, partnerNumber)
        .map(n => data.identification[`partner${n}`])
        .map(partner => ({
          type: 'individual',
          document_number: getOnlyNumbers(partner.cpf),
          name: partner.name,
          email: partner.email,
        }))

      recipientData.register_information.managing_partners = partners
    }
  }
  return recipientData
}

export default formatToRecipient
