import { formatHeaderData } from './formatRecipient'

function formatAnTConfig (data) {
  const companyData = formatHeaderData(data)

  let identification = {
    cnpj: '',
    cnpjEmail: '',
    cnpjInformation: false,
    cnpjName: '',
    cnpjPhone: '',
    cnpjUrl: '',
    cpf: '',
    cpfEmail: '',
    cpfInformation: false,
    cpfName: '',
    cpfPhone: '',
    cpfUrl: '',
    documentType: data.bank_account.document_type,
  }
  if (data.bank_account.document_type === 'cpf' && data.register_information) {
    identification = {
      ...identification,
      cpf: data.bank_account.document_number,
      cpfEmail: data.register_information.email,
      cpfInformation: true,
      cpfName: data.register_information.name,
      cpfPhone: data.register_information.phone_numbers[0].number,
      cpfUrl: data.register_information.site_url,
      documentType: 'cpf',
    }
  } else {
    identification = {
      ...identification,
      cpf: data.bank_account.document_number,
      cpfInformation: false,
    }
  }

  const mountPartners = (previousState, partner, index) => ({
    ...previousState,
    [`partner${index}`]: {
      cpf: partner.document_number,
      name: partner.name,
      email: partner.email,
    },
  })

  const getPartnersData = partners => partners.reduce(mountPartners, {})

  if (data.bank_account.document_type === 'cnpj' && data.register_information) {
    const partnersData = getPartnersData(data
      .register_information.managing_partners)
    identification = {
      ...identification,
      cnpj: data.bank_account.document_number,
      cnpjEmail: data.register_information.email,
      cnpjInformation: true,
      cnpjName: data.register_information.company_name,
      cnpjPhone: data.register_information.phone_numbers[0].number,
      cnpjUrl: data.register_information.site_url,
      documentType: 'cnpj',
      partnerNumber: data
        .register_information.managing_partners.length.toString(),
      ...partnersData,
    }
  } else {
    identification = {
      ...identification,
      cnpj: data.bank_account.document_number,
      cnpjInformation: false,
    }
  }

  let configuration = {
    anticipationModel: data.automatic_anticipation_type,
    anticipationVolumePercentage: data
      .anticipatable_volume_percentage.toString(),
    anticipationDays: data.automatic_anticipation_days,
    transferEnabled: data.transfer_enabled,
    transferInterval: data.transfer_interval,
    transferDay: (data.transfer_day) ? data.transfer_day.toString() : '',
    transferWeekday: '',
  }

  let transfer = {
    transferDay: (data.transfer_day) ? data.transfer_day.toString() : '',
    transferEnabled: data.transfer_enabled,
    transferInterval: data.transfer_interval,
    transferWeekday: '',
  }

  if (data.transfer_interval === 'daily') {
    configuration = {
      ...configuration,
      transferDay: '0',
    }
    transfer = {
      ...transfer,
      transferDay: '0',
    }
  }
  if (data.transfer_interval === 'weekly') {
    configuration = {
      ...configuration,
      transferDay: '',
      transferWeekday: (data.transfer_day) ? data.transfer_day.toString() : '',
    }
    transfer = {
      ...configuration,
      transferDay: '',
      transferWeekday: (data.transfer_day) ? data.transfer_day.toString() : '',
    }
  }

  const informationData = {
    identification,
    configuration,
    bankAccount: {
      agency_digit: data.bank_account.agencia_dv,
      agency: data.bank_account.agencia,
      bank: data.bank_account.bank_code,
      name: data.bank_account.legal_name,
      number_digit: data.bank_account.conta_dv,
      number: data.bank_account.conta,
      type: data.bank_account.type,
    },
  }

  let anticipation = {
    anticipationDays: data.automatic_anticipation_days,
    anticipationModel: '',
    anticipationVolumePercentage: data
      .anticipatable_volume_percentage.toString(),
  }

  if (data.automatic_anticipation_type === 'full' &&
      data.automatic_anticipation_enabled) {
    anticipation = {
      ...anticipation,
      anticipationModel: 'automatic_volume',
    }
  } else if (data.automatic_anticipation_type === '1025' &&
      data.automatic_anticipation_enabled) {
    anticipation = {
      ...anticipation,
      anticipationModel: 'automatic_dx',
    }
  } else if (data.automatic_anticipation_type === '1025' &&
      data.automatic_anticipation_1025_delay === 15) {
    anticipation = {
      ...anticipation,
      anticipationModel: 'automatic_1025',
    }
  } else if (data.automatic_anticipation_type === 'full' &&
      data.automatic_anticipation_enabled === false) {
    anticipation = {
      ...anticipation,
      anticipationModel: 'manual',
    }
  }

  const formatBankAccount = (foundBankAccounts) => {
    const accounts = foundBankAccounts.map(account => ({
      name: account.legal_name,
      number: account.conta,
      number_digit: account.conta_dv,
      type: account.type,
      agency: account.agencia,
      agency_digit: account.agencia_dv || '',
      bank: account.bank_code,
      id: account.id.toString(),
    }))
    return { accounts }
  }

  const configurationData = {
    anticipation,
    transfer,
    bankAccount: {
      name: data.bank_account.legal_name,
      number: data.bank_account.conta.toString(),
      type: data.bank_account.type,
      agency: data.bank_account.agencia,
      bank: data.bank_account.bank_code,
      id: data.bank_account.id.toString(),
    },
    accounts: formatBankAccount.accounts,
  }

  const dadosFormatados = {
    companyData,
    informationData,
    configurationData,
  }

  return dadosFormatados
}

export default formatAnTConfig
