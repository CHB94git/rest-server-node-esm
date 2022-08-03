import mongoose from 'mongoose';

const { Schema } = mongoose

const ProductoSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    description: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

ProductoSchema.methods.toJSON = function () {
    const { __v, state, _id, ...data } = this.toObject()
    let id_product = _id
    let product = Object.assign({ id_product }, data)
    return product
}

const Producto = mongoose.model('Producto', ProductoSchema)

export default Producto