import Axios from 'axios'
import config from '../config'
import { SettingsInterface, SMTPSettings } from '../interfaces/Settings'

class Settings implements SettingsInterface {
  public static async retrieve(): Promise<Settings> {
    let settings
    try {
      const settingsRequest = await Axios.get(`${config.openBazaarHost}/ob/settings`)
      settings = new Settings(settingsRequest.data)
    } catch (e) {
      await Axios.post(`${config.openBazaarHost}/ob/settings`, {})
      settings = new Settings()
    }
    return settings
  }

  public blockedNodes: string[] = []
  public country: string = ''
  public localCurrency: string = ''
  public mispaymentBuffer: number = 1
  public paymentDataInQR: boolean = false
  public refundPolicy: string = ''
  public shippingAddresses: [] = []
  public showNotifications: boolean = true
  public showNsfw: boolean = false
  public smtpSettings: SMTPSettings = {
    notifications: false,
    password: '',
    recipientEmail: '',
    senderEmail: '',
    serverAddress: '',
    username: '',
  }
  public storeModerators: string[] = []
  public termsAndConditions: string = ''
  public version: string = ''

  constructor(props?) {
    if (props) {
      Object.assign(this, props)
    }
  }

  public async save() {
    await Axios.get(`${config.openBazaarHost}/ob/settings`)
    await Axios.put(`${config.openBazaarHost}/ob/settings`, this)
  }
}

export default Settings
