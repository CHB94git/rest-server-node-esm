import { Router } from 'express'
import { param } from 'express-validator'

import { uploadsController } from '../controllers/index.js'
import { allowedCollections } from '../helpers/index.js'
import { validateFields, validateUploadFile } from '../middlewares/index.js'

const router = Router()

router.post('/', validateUploadFile, uploadsController.loadFile)

router.route('/:collection/:id')
    .get([
        param('id', 'El ID debe ser un MongoID válido').isMongoId(),
        param('collection').custom(c => allowedCollections(c, ['usuarios', 'productos'])),
        validateFields
    ], uploadsController.showImage)

    .put([
        validateUploadFile,
        param('id', 'El ID debe ser un MongoID válido').isMongoId(),
        param('collection').custom(c => allowedCollections(c, ['usuarios', 'productos'])),
        validateFields
    ], uploadsController.updateImageCloudinary)


export default router