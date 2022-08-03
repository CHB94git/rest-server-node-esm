import { request, response } from 'express';
import { Producto } from '../models/index.js';


// Obtener todas los productos
const getProducts = async (req = request, res = response) => {

    const { until = 20, from = 0 } = req.query

    if (isNaN(until) || isNaN(from)) {
        return res.status(400).json({
            msg: 'El(los) valor(es) específicados no son un número!'
        })
    }

    const [total, productos] = await Promise.all([
        Producto.countDocuments({ state: true }),
        Producto.find({ state: true })
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(from))
            .limit(Number(until))
    ])

    res.json({
        total,
        productos
    })
}

// Obtener un producto en específico
const getProduct = async (req, res) => {
    const { id } = req.params
    const producto = await Producto.findById(id)
        .populate('user', 'name')
        .populate('category', 'name')

    res.json(producto)
}

// Crear un producto
const createProduct = async (req = request, res = response) => {

    const { state, user, ...body } = req.body

    const productDB = await Producto.findOne({ name: body.name })

    try {
        if (productDB) {
            return res.status(400).json({
                msg: `El producto ${productDB.name}, ya existe!`
            })
        }

        // Generar la data a Guardar
        const data = {
            ...body,
            name: body.name.toUpperCase(),
            user: req.usuario._id
        }

        const producto = new Producto(data)
        await producto.save()

        res.status(201).json({
            producto
        })

    } catch (error) {
        console.log(error)
    }

}

// Actualizar una categoría
const updateProduct = async (req = request, res = response) => {

    const { id } = req.params
    const { state, user, ...data } = req.body

    // Actualizar
    if (data.name) {
        data.name = data.name.toUpperCase()
    }

    data.user = req.usuario._id

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true })

    res.json(producto)
}

// Borrar/Desactivar una categoría
const deleteProduct = async (req = request, res = response) => {

    const { id } = req.params
    const productDeleted = await Producto.findByIdAndUpdate(id, { state: false }, { new: true })

    res.json({
        msg: `El producto ${productDeleted.name} ha sido deshabilitada o eliminado`,
        productDeleted
    })

}

export {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct
}