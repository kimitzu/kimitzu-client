export default interface Constant {
  label: string
  value: string
}

export interface CryptoCurrencyConstant extends Constant {
  explorer: string
  icon: string
  color: string
}
