import Axios from 'axios'
import config from '../config'

export type VendorType = 'fulfill' | 'complete'

class PeerRating {
  public static async broadcast(vendorType: VendorType, order: any) {
    const broadcastRequest = await Axios.post(
      `${config.kimitzuHost}/p2p/ratings/publish/${vendorType}`,
      order
    )
    return broadcastRequest
  }
}

export default PeerRating
