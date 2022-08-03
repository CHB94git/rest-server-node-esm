import mongoose from 'mongoose';


const RoleSchema = mongoose.Schema({
    role: {
        type: String,
        required: [true, 'El rol es requerido']
    }
})

const Role = mongoose.model('Role', RoleSchema)

export default Role