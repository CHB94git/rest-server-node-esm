import mongoose from 'mongoose';

const connectionDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        const url = `${db.connection.host}:${db.connection.port}`
        console.log('Conexión exitosa a la Base de Datos!')
        console.log(`MongoDB conectado en: ${url}`)
    } catch (error) {
        console.log(error)
        throw new Error('Error al conectar la Base de Datos')
    }
}


export { connectionDB }