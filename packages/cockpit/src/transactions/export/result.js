import {
  applySpec,
  map,
  path,
  pipe,
  prop,
  values,
} from 'ramda'

import transactionSpec from '../shared/export'

const headers = [
  'Status',
  'ID',
  'Data',
  'Nome',
  'Forma de Pagamento',
  'Número do Cartão',
  'Documento',
  'Email',
  'ID da Assinatura',
  'Telefone',
  'Operadora de Cartão',
  'Resposta da Operadora',
  'IP',
  'Bandeira do Cartão',
  'Valor (R$)',
  'Valor Capturado (R$)',
  'Valor Estornado (R$)',
  'Recebedores',
  'Endereço',
  'Número do Endereço',
  'Complemento',
  'Bairro',
  'CEP',
  'Cidade',
  'Estado',
  'Score Pagar.me',
]

const exportKeysCSV = () => headers.map(value => `"${value}"`).join(',')

const format = exportType => (exportData) => {
  if (exportType === 'csv') {
    return values(exportData).map(value => `"${value}"`).join(',')
  }

  return values(exportData)
}

const filterProps = applySpec(transactionSpec)

const formatLines = exportType => map(pipe(
  prop('_source'),
  filterProps,
  format(exportType)
))

const buildData = exportType => (exportData) => {
  if (exportType === 'csv') {
    const header = exportKeysCSV()
    const lines = formatLines(exportType)
    return [header].concat(lines(exportData)).join('\r\n')
  }

  const lines = formatLines(exportType)
  return [headers].concat(lines(exportData))
}

const buildResult = exportType => pipe(
  path(['hits', 'hits']),
  buildData(exportType)
)

export default buildResult
