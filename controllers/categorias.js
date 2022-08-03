import { request, response } from 'express';
import { Categoria } from '../models/index.js';


// Obtener todas las categorías
const categoriasGetAll = async (req = request, res = response) => {

    const { until = 20, from = 0 } = req.query

    if (isNaN(until) || isNaN(from)) {
        return res.status(400).json({
            msg: 'El(los) valor(es) específicados no son un número!'
        })
    }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments({ state: true }),
        Categoria.find({ state: true })
            .populate('user', 'name')
            .skip(Number(from))
            .limit(Number(until))
    ])

    res.json({
        total,
        categorias
    })
}

// Obtener una categoría en específico
const categoriaGetOne = async (req, res) => {

    const { id } = req.params

    const categoria = await Categoria.findById(id)
        .populate('user', 'name')

    res.json(categoria)
}

// Crear una categoría
const categoriasPost = async (req = request, res = response) => {

    const name = req.body.name.toUpperCase()

    const categorieDB = await Categoria.findOne({ name })

    try {
        if (categorieDB) {
            return res.status(400).json({
                msg: `La categoría ${categorieDB.name}, ya existe!`
            })
        }

        // Generar la data a Guardar
        const data = {
            name,
            user: req.usuario._id
        }

        const categoria = new Categoria(data)
        await categoria.save()

        res.status(201).json({
            categoria
        })

    } catch (error) {
        console.log(error)
    }

}

// Actualizar una categoría
const categoriasPut = async (req = request, res = response) => {

    const { id } = req.params
    const { state, user, ...data } = req.body

    // Actualizar
    data.name = data.name.toUpperCase()
    data.user = req.usuario._id

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true })

    res.json(categoria)
}

// Borrar/Desactivar una categoría
const categoriasDelete = async (req = request, res = response) => {

    const { id } = req.params
    const categorieDeleted = await Categoria.findByIdAndUpdate(id, { state: false }, { new: true })

    res.json({
        msg: `La categoría ${categorieDeleted.name} ha sido deshabilitada`,
        categorieDeleted
    })

}

export {
    categoriaGetOne,
    categoriasDelete,
    categoriasGetAll,
    categoriasPost,
    categoriasPut,
}