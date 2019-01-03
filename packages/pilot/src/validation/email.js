import isEmail from 'validator/lib/isEmail'

export default message => value => (!value || !isEmail(value)) && message
