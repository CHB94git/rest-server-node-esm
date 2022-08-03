import mongoose from 'mongoose';

const { Schema } = mongoose

const CategoriaSchema = mongoose.Schema({
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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

CategoriaSchema.methods.toJSON = function () {
    const { __v, state, _id, ...categoria } = this.toObject()
    let id_cat = _id
    let categoriaOrdenada = Object.assign({ id_cat }, categoria)
    return categoriaOrdenada
}

const Categoria = mongoose.model('Categoria', CategoriaSchema)

export default Categoria