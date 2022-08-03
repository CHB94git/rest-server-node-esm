import { request, response } from 'express';
import * as mongoose from 'mongoose';
import { Categoria, Producto, Usuario } from '../models/index.js';


const allowedCollections = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
]

const searchUsers = async (termSearch = '', res = response) => {
    const isMongoID = mongoose.Types.ObjectId.isValid(termSearch) // TRUE

    if (isMongoID) {
        const user = await Usuario.findById(termSearch)
        return res.json({
            results: (user) ? [user] : []
        })
    }

    const regEx = new RegExp(termSearch, 'i')

    const users = await Usuario.find({
        $or: [{ name: regEx }, { email: regEx }],
        $and: [{ state: true }]
    })

    res.json({
        results: users
    })
}

const searchCategories = async (termSearch = '', res = response) => {
    const isMongoID = mongoose.Types.ObjectId.isValid(termSearch) // TRUE

    if (isMongoID) {
        const categorie = await Categoria.findById(termSearch).populate('category', 'name')
        return res.json({
            results: (categorie) ? [categorie] : []
        })
    }

    const regEx = new RegExp(termSearch, 'i')

    const categories = await Categoria
        .find({ name: regEx, state: true })

    res.json({
        results: categories
    })
}

const searchProducts = async (termSearch, res) => {
    const isMongoID = mongoose.Types.ObjectId.isValid(termSearch) // TRUE

    if (isMongoID) {
        const product = await Producto.findById(termSearch).populate('category', 'name')
        return res.json({
            results: (product) ? [product] : []
        })
    }

    const regEx = new RegExp(termSearch, 'i')

    const products = await Producto
        .find({ name: regEx, state: true })

    res.json({
        results: products
    })
}


const search = async (req = request, res = response) => {
    const { collection, termSearch } = req.params

    if (!allowedCollections.includes(collection)) {
        return res.status(400).json({
            err: `La colección ${collection} no está disponible en la búsqueda`,
            msg: `Las colecciones permitidas en la búsqueda son: ${allowedCollections}`
        })
    }

    switch (collection) {
        case 'usuarios':
            searchUsers(termSearch, res)
            break;

        case 'categorias':
            searchCategories(termSearch, res)
            break;

        case 'productos':
            searchProducts(termSearch, res)
            break;

        default:
            res.status(500).json({
                msg: 'Se le olvidó hacer esta búsqueda'
            })
    }
}


export { search }