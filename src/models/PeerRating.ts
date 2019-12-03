import Axios from 'axios'
import config from '../config'
import { PeerToPeerRating } from '../interfaces/PeerToPeerRating'

export type VendorType = 'fulfill' | 'complete'

class PeerRating {
  public static async broadcast(vendorType: VendorType, order: any) {
    const broadcastRequest = await Axios.post(
      `${config.kimitzuHost}/p2p/ratings/publish/${vendorType}`,
      order
    )
    return broadcastRequest
  }

  public static async seek(id: string): Promise<PeerToPeerRating> {
    const seekRequest = await Axios.get(`${config.kimitzuHost}/p2p/ratings/seek-sync/${id}`)
    return seekRequest.data
  }
}

export default PeerRating
