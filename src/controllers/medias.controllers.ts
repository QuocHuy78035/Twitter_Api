import { Request, Response, NextFunction } from 'express'
import HTTP_STATUS from '~/constants/http.status'
import { USER_MESSAGE } from '~/constants/message'
import mediaService from '~/services/medias.service'
import { handleUploadFile } from '~/utils/file'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await mediaService.handleUploadImage(req)
    console.log(result)
    return res.status(200).json({
      message: USER_MESSAGE.UPLOAD_FILE_SUCCESS,
      data: result
    })
  } catch (err) {
    if (err instanceof Error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'File size exceeds limit. Max file size is 300KB.' })
    } else {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Failed to upload file.' })
    }
  }
}
