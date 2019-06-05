// Require `PhoneNumberFormat`.
export const PNF = require('google-libphonenumber').PhoneNumberFormat

// Get an instance of `PhoneNumberUtil`.
export const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

// As you type formatter
export const AsYouTypeFormatter = require('google-libphonenumber')
  .AsYouTypeFormatter

// Parse number with country code and keep raw input.
export const parseNumber = (number, countryCode) => {
  return phoneUtil.parse(number, countryCode)
}

// Format number in the national format.
export const formatNationalNumber = number => {
  return phoneUtil.format(parseNumber(number), PNF.NATIONAL)
}

// Format number in the international format.
export const formatInternationalNumber = number => {
  return phoneUtil.format(parseNumber(number), PNF.INTERNATIONAL)
}

// Format number in the original format.
export const formatInOriginalFormat = (number, countryCode) => {
  return phoneUtil.formatInOriginalFormat(parseNumber(number), countryCode)
}

export const formatPartialByCountry = (numArr, countryCode) => {
  const formatter = new AsYouTypeFormatter(countryCode)

  numArr.forEach(num => {
    formatter.inputDigit(num)
  })

  return formatter.currentOutput_
}

export const isValidNumber = (number, countryCode) => {
  return phoneUtil.isValidNumber(parseNumber(number, countryCode))
}
