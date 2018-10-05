export function formatHeaderData (data) {
  const headerData = {
    createDate: data.date_created,
    hash: data.id,
    id: data.bank_account.id.toString(),
    name: data.bank_account.legal_name,
    status: data.status,
  }

  const register = data.register_information

  if (register) {
    if (register.type === 'individual') {
      headerData.name = register.name
    }

    if (register.type === 'corporation') {
      headerData.name = register.company_name
    }
  }

  return headerData
}

export function formatConfigurationData (data) {
  return data
}

export function formatIdentification (data) {
  return data
}

export function formatAnticipationDataWhenUpdate (data) {
  return data
}
