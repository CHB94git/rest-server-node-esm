import { response } from 'express';
import bcrypt from 'bcrypt';
import { Usuario } from '../models/index.js'
import { generarJWT, googleVerify } from '../helpers/index.js';


const login = async (req, res = response) => {

    const { email, password } = req.body

    try {
        // Verificar sí el email existe
        const usuario = await Usuario.findOne({
            email
        })

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            })
        }

        if (!usuario.state) {
            return res.status(400).json({
                msg: 'Usuario no activo - State: false'
            })
        }

        // Sí el usuario está activo
        const passValidate = bcrypt.compareSync(password, usuario.password)

        // Verificar la contraseña
        if (!passValidate) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Algo salió mal"
        })
    }
}


const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body

    try {
        const { name, email, img } = await googleVerify(id_token)

        let usuario = await Usuario.findOne({ email })

        if (!usuario) {
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true
            }
            usuario = new Usuario(data)
            await usuario.save()
        }

        // Si el usuario en DB
        if (!usuario.state) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado o deshabilitado!'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar'
        })
    }

}



export {
    googleSignIn,
    login,
}