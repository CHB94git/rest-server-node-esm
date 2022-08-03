import { Router } from 'express'
import { body } from 'express-validator'

import { validateFields } from '../middlewares/index.js'
import { authController } from '../controllers/index.js'

const router = Router()

router.post('/login', [
    body('email', 'El email es obligatorio').isEmail(),
    body('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], authController.login)

router.post('/google', [
    body('id_token', 'ID Token de autenticación de Google es necesario').not().isEmpty(),
    validateFields
], authController.googleSignIn)

export default router