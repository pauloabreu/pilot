import {
  __,
  always,
  append,
  defaultTo,
  divide,
  either,
  head,
  ifElse,
  is,
  isEmpty,
  isNil,
  join,
  juxt,
  last,
  length,
  map,
  path,
  pathOr,
  pathSatisfies,
  pipe,
  pick,
  prop,
  propEq,
  props,
  propIs,
  propOr,
  splitAt,
  values,
} from 'ramda'
import moment from 'moment'
import acquirerNames from './acquirerNames'
import antifraudStatusNames from './antifraudStatusNames'
import cardBrandNames from './cardBrandNames'
import statusNames from './statusName'

const LIMITER = '-'

const isEmptyOrNill = either(isNil, isEmpty)

const defaultToLimiter = defaultTo(LIMITER)

const propOrLimiter = property => pipe(
  propOr(LIMITER, property),
  defaultToLimiter
)

const getAntifraudProp = pipe(
  propOr('unknown', 'risk_level'),
  prop(__, antifraudStatusNames)
)

const pickCardDigits = pick(['card_first_digits', 'card_last_digits'])

const concatCardDigits = pipe(
  pickCardDigits,
  values,
  join('******')
)

const getCardNumber = ifElse(
  propIs(String, 'card_first_digits'),
  concatCardDigits,
  always(LIMITER)
)

const getCustomerName = pathOr(LIMITER, ['customer', 'name'])

const getCustomerSubProp = subProp => pathOr(LIMITER, ['customer', subProp])

const getAddressSubProp = property => either(
  pathOr(LIMITER, ['billing', 'address', property]),
  pathOr(LIMITER, ['address', property])
)

const getStatusName = pipe(
  prop('status'),
  prop(__, statusNames)
)

const isStatusRefused = propEq('status', 'refused')

const getRefuseReason = pipe(
  prop('status_reason'),
  append(__, ['refused']),
  path(__, statusNames)
)

const getStatus = ifElse(
  isStatusRefused,
  getRefuseReason,
  getStatusName
)

const paymentMethodNames = {
  boleto: 'Boleto',
  credit_card: 'Cartão de Crédito',
}

const getPaymentMethod = pipe(
  prop('payment_method'),
  prop(__, paymentMethodNames)
)

const completeNumberRegex = /(\+*[0-9]{2})([1-9]{2})(([9][0-9]{4})|[0-9]{4})([0-9]{4})/

const isCompletePhoneNumber = number => completeNumberRegex.test(number)

const formatPhoneNumber = (number) => {
  if (!number) return ''
  const phoneLength = length(number)
  const [phoneRemainder, last4Digit] = splitAt((phoneLength - 4), number)

  // this case is common for API versions 2013-03-01 and 2017-07-17
  if (phoneLength <= 9) {
    return `${phoneRemainder}-${last4Digit}`
  }

  const phoneRemainderLength = length(phoneRemainder)

  if (isCompletePhoneNumber(number)) {
    const splitIndex = phoneRemainderLength >= 10
      ? phoneRemainderLength - 5
      : phoneRemainderLength - 4
    const [remainder, firstDigits] = splitAt(
      splitIndex,
      phoneRemainder
    )
    const [ddi, ddd] = splitAt(length(remainder) - 2, remainder)
    let outNumber = `${firstDigits}-${last4Digit}`

    if (ddd) {
      outNumber = `(${ddd}) ${outNumber}`
    }

    if (ddi) {
      outNumber = `${ddi} ${outNumber}`
    }

    return outNumber
  }

  const splitIndex = phoneRemainderLength >= 7
    ? phoneRemainderLength - 5
    : phoneRemainderLength - 4

  const [remainder, firstDigits] = splitAt(
    splitIndex,
    phoneRemainder
  )

  return `(${remainder}) ${firstDigits}-${last4Digit}`
}

const formatPhone = pipe(
  props(['ddd', 'number']),
  juxt([
    pipe(
      head,
      ddd => `(${ddd})`
    ),
    pipe(
      last,
      formatPhoneNumber
    ),
  ]),
  join(' ')
)

const getRecipients = pipe(
  prop('split_rules'),
  ifElse(
    is(Array),
    pipe(
      map(propOr('', 'id')),
      join(', ')
    ),
    always('Recebedor Padrão')
  )
)

const getPhone = pipe(
  prop('phone'),
  ifElse(
    isEmptyOrNill,
    always(LIMITER),
    formatPhone
  )
)

const formatPhones = pipe(
  path(['customer', 'phone_numbers']),
  ifElse(
    isEmptyOrNill,
    always(LIMITER),
    pipe(
      map(formatPhoneNumber),
      join(', ')
    )
  )
)

const getPhones = ifElse(
  pipe(
    prop('phone'),
    isEmptyOrNill
  ),
  formatPhones,
  getPhone
)

const getId = prop('id')

const getDocuments = pipe(
  path(['customer', 'documents']),
  ifElse(
    is(Array),
    pipe(
      map(propOr('', 'number')),
      join(', ')
    ),
    always(LIMITER)
  )
)

const getDocumentNumber = ifElse(
  pathSatisfies(isEmptyOrNill, ['customer', 'documents']),
  path(['customer', 'document_number']),
  getDocuments
)

const formatDate = date => moment(date).format('DD/MM/YYYY HH:mm')

const getCreatedDate = pipe(
  prop('date_created'),
  formatDate
)

const getAcquirerName = pipe(
  prop('acquirer_name'),
  prop(__, acquirerNames),
  defaultToLimiter
)

const getCardBrand = pipe(
  prop('card_brand'),
  prop(__, cardBrandNames),
  defaultToLimiter
)

const getBRLProp = property => pipe(
  prop(property),
  ifElse(
    isNil,
    always(0),
    divide(__, 100)
  )
)

const transactionSpec = {
  status: getStatus,
  id: getId,
  created_at: getCreatedDate,
  name: getCustomerName,
  payment_method: getPaymentMethod,
  card_number: getCardNumber,
  documents: getDocumentNumber,
  email: getCustomerSubProp('email'),
  subscription: propOrLimiter('subscription_id'),
  phones: getPhones,
  acquirer_name: getAcquirerName,
  acquirer_response_code: propOrLimiter('acquirer_response_code'),
  ip: propOrLimiter('ip'),
  brand_name: getCardBrand,
  amount: getBRLProp('amount'),
  paid_amount: getBRLProp('paid_amount'),
  refunded_amount: getBRLProp('refunded_amount'),
  split_rules: getRecipients,
  street: getAddressSubProp('street'),
  streetNumber: getAddressSubProp('street_number'),
  complementary: getAddressSubProp('complementary'),
  neighborhood: getAddressSubProp('neighborhood'),
  zipcode: getAddressSubProp('zipcode'),
  city: getAddressSubProp('city'),
  state: getAddressSubProp('state'),
  antifraud: getAntifraudProp,
}

export default transactionSpec
