import { Router } from 'express'

import { search } from '../controllers/index.js'

const router = Router()

router.get('/:collection/:termSearch', search)


export default router