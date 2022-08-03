import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';

import { connectionDB } from '../database/config.js';

import {
    authRoutes,
    busquedasRoutes,
    categoriasRoutes,
    usuariosRoutes,
    productosRoutes,
    uploadsRoutes
} from '../routes/index.js';

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT

        this.paths = {
            auth: '/api/auth',
            busquedas: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            uploads: '/api/uploads',
            usuarios: '/api/usuarios'
        }

        // Conectar a la BD
        this.connectDB()

        // Middlewares
        this.middlewares()

        // Rutas de la App
        this.routes()
    }

    async connectDB () {
        await connectionDB()
    }

    middlewares () {
        // CORS
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use(express.json())

        // Directorio público
        this.app.use(express.static('public'))

        // FileUpload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }))
    }

    routes () {
        this.app.use(this.paths.auth, authRoutes)
        this.app.use(this.paths.busquedas, busquedasRoutes)
        this.app.use(this.paths.categorias, categoriasRoutes,)
        this.app.use(this.paths.productos, productosRoutes)
        this.app.use(this.paths.uploads, uploadsRoutes)
        this.app.use(this.paths.usuarios, usuariosRoutes)
    }

    listen () {
        this.app.listen(this.port, () => {
            console.log(`Server running in port ${this.port}`)
        })
    }
}


export default Server
