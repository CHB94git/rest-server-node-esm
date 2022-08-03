import { request, response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fileSystem from 'fs';
import { v2 as cloudinary } from 'cloudinary'

import { Producto, Usuario } from '../models/index.js'
import { fileUploadHelper } from '../helpers/index.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

cloudinary.config(process.env.CLOUDINARY_URL)

/* cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
}) */




const loadFile = async (req = request, res = response) => {
    try {
        const nombre = await fileUploadHelper(req.files, undefined, 'Imgs')

        res.json({ nombre })

    } catch (msg) {
        res.status(400).json({ msg })
    }
}


const updateImage = async (req = request, res = response) => {
    const { collection, id } = req.params

    let model

    switch (collection) {
        case 'usuarios':
            model = await Usuario.findById(id)

            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            model = await Producto.findById(id)

            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Esto no está validado'
            })
    }

    try {
        // Limpiar imágenes previas
        if (model.img) {
            // Borrar la imagen del servidor
            const pathImage = path.join(__dirname, '../uploads', collection, model.img)
            if (fileSystem.existsSync(pathImage)) {
                fileSystem.unlinkSync(pathImage)
            }
        }
    } catch (error) {
        console.log(error)
    }

    const nameFile = await fileUploadHelper(req.files, undefined, collection)

    model.img = nameFile

    await model.save()

    res.json({ model })
}


const updateImageCloudinary = async (req = request, res = response) => {
    const { collection, id } = req.params

    let model

    switch (collection) {
        case 'usuarios':
            model = await Usuario.findById(id)

            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            model = await Producto.findById(id)

            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Esto no está validado'
            })
    }

    try {
        // Limpiar imágenes previas de Cloudinary
        if (model.img) {
            const arrayName = model.img.split('/')
            const name = arrayName.pop()
            const [public_id] = name.split('.')
            cloudinary.uploader.destroy(`CURSO_NODE/${collection}/${public_id}`)
        }

        // Guardar en cloudinary
        const { tempFilePath } = req.files.file
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: `CURSO_NODE/${collection}` })

        model.img = secure_url

        await model.save()
        res.json({ model })
    } catch (error) {
        console.log(error)
    }
}


const showImage = async (req = request, res = response) => {
    const { collection, id } = req.params

    let model

    switch (collection) {
        case 'usuarios':
            model = await Usuario.findById(id)

            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            model = await Producto.findById(id)

            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Esto no está validado'
            })
    }

    try {
        if (model.img) {
            const pathImage = path.join(__dirname, '../uploads', collection, model.img)

            // Retornar la imagen local
            if (fileSystem.existsSync(pathImage)) {
                return res.sendFile(pathImage)
            }
            // Obtener y enviar el public_id al request
            const arrayName = model.img.split('/')
            const name = arrayName.pop()
            const [public_id] = name.split('.')

            const { secure_url } = await cloudinary.api.resource(`CURSO_NODE/${collection}/${public_id}`, {
                resource_type: 'image'
            })

            // Retornar URL de la imagen alojada en cloudinary
            if (secure_url) {
                return res.json(secure_url)
            }

        } else {
            const pathImage404 = path.join(__dirname, '../assets/no-image.jpg')
            res.sendFile(pathImage404)
        }
    } catch (error) {
        res.status(500).json({ message: 'Ha ocurrido un error' })
        throw (error)
    }
}


export {
    loadFile,
    showImage,
    updateImage,
    updateImageCloudinary
}
