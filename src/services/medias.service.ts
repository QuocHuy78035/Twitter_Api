import { Request } from 'express'
import { getNameFromFullName, handleUploadFile } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import path from 'path'
import fs from 'fs'
import { MediaType } from '~/constants/enums'

class MediaServices {
  async handleUploadImage(req: Request) {
    const files = await handleUploadFile(req)
    // const new_name = getNameFromFullName(file.newFilename)
    // const new_path = path.resolve(UPLOAD_DIR, `${new_name}.jpg`)
    // await sharp(file.filepath).jpeg().toFile(new_path)
    // fs.unlinkSync(file.filepath)
    // return `http://localhost:3000/static/${new_name}.jpg`

    const result = await Promise.all(
      files.map(async (file) => {
        const new_name = getNameFromFullName(file.newFilename)
        const new_path = path.resolve(UPLOAD_DIR, `${new_name}.jpg`)
        await sharp(file.filepath).jpeg().toFile(new_path)
        fs.unlinkSync(file.filepath)
        return {
          url: `http://localhost:3000/static/image/${new_name}.jpg`,
          type: MediaType.Image
        }
      })
    )
    return result
  }
}

const mediaService = new MediaServices()
export default mediaService
