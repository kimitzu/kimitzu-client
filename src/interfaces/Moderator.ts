export interface Moderator {
  description: string
  termsAndConditions: string
  languages: string[]
  fee: Fee
  acceptedCurrencies: string[]
}

export interface Fee {
  feeType: string
  percentage?: number
  fixedFee?: Price
}

export interface Price {
  currencyCode: string
  amount: number
}
