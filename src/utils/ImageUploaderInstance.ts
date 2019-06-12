import Axios from 'axios'
import config from '../config'
import { RHashes } from '../models/Profile'

class ImageUploader {
  public async uploadImage(base64Image: string): Promise<RHashes> {
    const avatar = base64Image.split(',')
    const response = await Axios.post(`${config.openBazaarHost}/ob/images`, [
      {
        filename: 'image.png',
        image: avatar[1],
      },
    ])
    return { ...response.data[0].hashes, filename: 'image.png' }
  }

  public async convertToBase64(imageFile: any): Promise<string> {
    const reader = new FileReader()
    reader.readAsDataURL(imageFile)
    return new Promise(resolve => {
      reader.onload = () => {
        const result = reader.result as string
        resolve(result)
      }
    })
  }
}

const ImageUploaderInstance = new ImageUploader()
export default ImageUploaderInstance
