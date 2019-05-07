// Require `PhoneNumberFormat`.
const PNF = require('google-libphonenumber').PhoneNumberFormat

// Get an instance of `PhoneNumberUtil`.
export const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

// Parse number with country code and keep raw input.
export const parseNumber = num => {
  return phoneUtil.parse('1' + num, 'US')
}
