import Axios from 'axios'
import config from '../config'

class Wallet {
  public static async getAddresses() {
    const addressRequest = await Axios.get(`${config.openBazaarHost}/wallet/address`)
    return addressRequest.data
  }

  public static async getBalances() {
    const balanceRequest = await Axios.get(`${config.openBazaarHost}/wallet/balance`)
    return balanceRequest.data
  }

  public static async getTransactions(cryptoCurrency: string) {
    const transactionsRequest = await Axios.get(
      `${config.openBazaarHost}/wallet/transactions/${cryptoCurrency.toLowerCase()}`
    )
    return transactionsRequest.data
  }

  public static async send(
    cryptoCurrency: string,
    recipient: string,
    amount: number,
    feeLevel: string,
    memo: string
  ) {
    const sendRequest = await Axios.post(`${config.openBazaarHost}/wallet/spend`, {
      wallet: cryptoCurrency.toUpperCase(),
      address: recipient,
      amount,
      feeLevel: feeLevel || 'NORMAL',
      memo,
      spendAll: false,
    })
    return sendRequest.data
  }
}

export default Wallet
