import { Router } from 'express'
import { body, param } from 'express-validator'

import { usuariosController } from '../controllers/index.js'
import { dbValidators } from '../helpers/index.js'
import { rolesValidate, validateFields, validateJWT } from '../middlewares/index.js'

const router = Router()

router.route('/')
    .get(usuariosController.usuariosGet)
    .post([
        body('name', 'El nombre es requerido').not().isEmpty(),
        body('password', 'La contraseña debe ser de mínimo 6 caracteres').isLength({ min: 6 }),
        body('email', 'El email no es válido').isEmail(),
        body('email').custom(dbValidators.emailExists),
        body('role').custom(dbValidators.isValidRole),
        validateFields
    ], usuariosController.usuariosPost)


router.route('/:id')
    .put([
        param('id', 'No es un ID válido').isMongoId(),
        param('id').custom(dbValidators.existUserByID),
        body('role').custom(dbValidators.isValidRole),
        validateFields
    ], usuariosController.usuariosPut)
    .patch([
        validateJWT,
        param('id', 'No es un ID válido').isMongoId(),
        param('id').custom(dbValidators.existUserByID),
        validateFields
    ], usuariosController.usuariosPatch)
    .delete([
        validateJWT,
        rolesValidate.isAdminRole,
        rolesValidate.haveRole('ADMIN_ROLE', 'USER_ROLE'),
        param('id', 'No es un ID válido').isMongoId(),
        param('id').custom(dbValidators.existUserByID),
        validateFields
    ], usuariosController.usuariosDelete)


export default router
