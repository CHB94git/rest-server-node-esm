import { request, response } from 'express';
import bcrypt from 'bcrypt';

import { Usuario } from '../models/index.js';


const usuariosGet = async (req = request, res = response) => {

    const { until = 20, from = 0 } = req.query

    if (isNaN(until) || isNaN(from)) {
        return res.status(400).json({
            msg: 'El(los) valor(es) específicados no son un número!'
        })
    }

    /* 
    // No es BUENA PRACTICA ENCADENAR PROMESAS CON AWAIT
    // Solo se hace sí una depende estrictamente de la otra
    
    const usuarios = await Usuario.find({ state: true })
        .skip(Number(from))
        .limit(Number(until))

    const total = await Usuario.countDocuments({ state: true }) */

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({ state: true }),
        Usuario.find({ state: true })
            .skip(Number(from))
            .limit(Number(until))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async (req = request, res = response) => {

    const { name, email, password, role } = req.body
    const usuario = new Usuario({ name, email, password, role })

    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync(10)
    usuario.password = bcrypt.hashSync(password, salt)

    // Guardar en BD
    await usuario.save()

    res.json({
        usuario
    })
}

const usuariosPut = async (req = request, res = response) => {
    const { id } = req.params
    const { _id, password, google, email, ...data } = req.body

    if (password) {
        const salt = bcrypt.genSaltSync(10)
        data.password = bcrypt.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, data, { new: true })

    res.json(usuario)
}

const usuariosPatch = async (req = request, res = response) => {

    const { id } = req.params

    const userEnable = await Usuario.findByIdAndUpdate(id, { state: true }, { new: true })

    res.json({
        msg: 'El usuario ha sido habilitado correctamente!',
        userEnable
    })
}

const usuariosDelete = async (req = request, res = response) => {
    const { id } = req.params

    // Borrar físicamente de la base de Datos - NO RECOMENDADO
    // const usuarioEliminado = await Usuario.findByIdAndDelete(id)

    const userDisabled = await Usuario.findByIdAndUpdate(id, { state: false }, { new: true })


    res.json({
        // msg: 'El usuario ha sido eliminado correctamente de la BD',
        // usuarioEliminado,
        msg: 'El usuario ha sido deshabilitado correctamente!',
        userDisabled,
    })
}


export {
    usuariosDelete,
    usuariosGet,
    usuariosPatch,
    usuariosPost,
    usuariosPut,
}
