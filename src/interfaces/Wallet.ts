export interface WalletBalance {
  confirmed: number
  height: number
  unconfirmed: number
}

export interface WalletBalances {
  [key: string]: WalletBalance
}

export interface Transactions {
  count: number
  transactions: Transaction[]
}

export interface Transaction {
  address: string
  canBumpFee: boolean
  confirmations: number
  errorMessage: string
  height: number
  memo: string
  orderId: string
  status: string
  thumbnail: string
  timestamp: string
  txid: string
  value: number
}
