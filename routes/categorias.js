import { Router } from 'express'
import { body, param } from 'express-validator'

import { categoriasController } from '../controllers/index.js'
import { dbValidators } from '../helpers/index.js'
import { validateJWT, validateFields, rolesValidate } from '../middlewares/index.js'


const router = Router()

// Obtener todas las categorías -Crear una categoría
router.route('/')
    .get(categoriasController.categoriasGetAll)
    .post([validateJWT,
        body('name', 'El nombre de la categoría es obligatorio').not().isEmpty(),
        validateFields
    ], categoriasController.categoriasPost)

// Obtener una categoría
router.get('/:id', [
    param('id', 'No es un ID de Mongo válido').isMongoId(),
    param('id').custom(dbValidators.existCategorieByID),
    validateFields
], categoriasController.categoriaGetOne)

// Actualizar una categoría
router.put('/:id', [
    validateJWT,
    param('id').custom(dbValidators.existCategorieByID),
    body('name', 'El nombre de la categoría es obligatorio').not().isEmpty(),
    validateFields
], categoriasController.categoriasPut)

// Eliminar - deshabilitar una categoría
router.delete('/:id', [
    validateJWT,
    rolesValidate.isAdminRole,
    param('id', 'No es un ID de Mongo válido').isMongoId(),
    param('id').custom(dbValidators.existCategorieByID),
    validateFields
], categoriasController.categoriasDelete)


export default router