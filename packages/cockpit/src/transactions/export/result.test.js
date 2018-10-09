import buildResult from './result'
import requestResultMock from './mocks/transactionsMockExport.json'
import mockCSV from './mocks/mockCSV'
import mockXLS from './mocks/mockXLS'

const buildResultToExportCSV = buildResult('csv')
const buildResultToExportXLS = buildResult('xls')

describe('Transactions to dashboard export data', () => {
  it('should work when transactions are returned csv', () => {
    const result = buildResultToExportCSV(requestResultMock)
    expect(result.replace(/\s/g, '')).toEqual(mockCSV.replace(/\s/g, ''))
  })

  it('should work when transactions are returned xls', () => {
    const result = buildResultToExportXLS(requestResultMock)
    expect(result).toEqual(mockXLS)
  })
})
