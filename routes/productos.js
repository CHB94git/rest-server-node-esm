import { Router } from 'express'
import { body, param } from 'express-validator'

import { productosController } from '../controllers/index.js'
import { dbValidators } from '../helpers/index.js'
import { validateJWT, validateFields, rolesValidate } from '../middlewares/index.js'


const router = Router()

// Obtener todos los Productos - Crear un Producto
router.route('/')
    .get(productosController.getProducts)
    .post([validateJWT,
        body('name', 'El nombre del producto es obligatorio').not().isEmpty(),
        body('category', 'No es un ID de Mongo válido').isMongoId(),
        body('category').custom(dbValidators.existCategorieByID),
        validateFields
    ], productosController.createProduct)


// Obtener un Producto
router.get('/:id', [
    param('id', 'No es un ID de Mongo válido').isMongoId(),
    param('id').custom(dbValidators.existProductByID),
    validateFields
], productosController.getProduct)


// Actualizar un Producto
router.put('/:id', [
    validateJWT,
    param('id', 'No es un ID de Mongo válido').isMongoId(),
    param('id').custom(dbValidators.existProductByID),
    body('category', 'No es un ID de Mongo válido').optional().isMongoId(),
    body('category').optional().custom(dbValidators.existCategorieByID),
    validateFields
], productosController.updateProduct)


// Eliminar un Producto
router.delete('/:id', [
    validateJWT,
    rolesValidate.isAdminRole,
    param('id', 'No es un ID de Mongo válido').isMongoId(),
    param('id').custom(dbValidators.existProductByID),
    validateFields
], productosController.deleteProduct)


export default router