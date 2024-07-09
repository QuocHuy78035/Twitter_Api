import fs from 'fs'
import formidable, { EmitData, File } from 'formidable'
import { Request } from 'express'
import { UPLOAD_TEMP_DIR } from '~/constants/dir'

export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, {
      recursive: true //de tao thu muc long nhau
    })
  }
}

export const handleUploadFile = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 300 * 1024, //300kb
    maxTotalFileSize: 300 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('data', new Error('Invalid file type. Expected an image.') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.image) {
        return reject(err)
      }
      resolve(files.image as File[])
    })
  })
}

export const getNameFromFullName = (full_name: string) => {
  const name_arr = full_name.split('.')
  name_arr.pop()
  return name_arr.join('')
}
