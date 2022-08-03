import { response, request } from 'express';
import jwt from 'jsonwebtoken';

import { Usuario } from '../models/index.js'

const validateJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        const usuario = await Usuario.findById(uid)

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - User dont exist'
            })
        }

        // Verificar si el usuario tiene estado true
        if (!usuario.state) {
            return res.status(401).json({
                msg: 'Token no válido - User state: false'
            })
        }

        req.usuario = usuario

        next()

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg: 'Token no válido'
        })
    }
}


export { validateJWT }