import { Request, Response, NextFunction } from 'express'
import HTTP_STATUS from '~/constants/http.status'
import { handleUploadSingleFile, test } from '~/utils/file'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = await handleUploadSingleFile(req)
    return res.json({ files })
  } catch (err) {
    if (err instanceof Error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'File size exceeds limit. Max file size is 300KB.' })
    } else {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Failed to upload file.' })
    }
  }
}
