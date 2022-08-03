import { Categoria, Usuario, Role, Producto } from '../models/index.js';

// Funciones/Validadores custom por Usuario
const isValidRole = async (role = '') => {
    const existRole = await Role.findOne({ role })
    if (!existRole) {
        throw new Error(`El rol ${role} no está registrado en la BD`)
    }
}

const emailExists = async (email = '') => {
    // Verificar si el correo existe
    const existEmail = await Usuario.findOne({ email });
    if (existEmail) {
        throw new Error(`El email: ${email}, ya está registrado`);
    }
}

const existUserByID = async (id) => {
    // Verificar si el usuario existe
    const existUser = await Usuario.findById(id);
    if (!existUser) {
        throw new Error(`El usuario con id: ${id}, no existe`);
    }
}

// Funciones/Validadores custom por Categoría
const existCategorieByID = async id => {
    const existCategorie = await Categoria.findById(id)

    if (!existCategorie) {
        throw new Error(`La categoría con id: ${id}, no existe`)
    }
}

const existProductByID = async id => {
    const existProduct = await Producto.findById(id)

    if (!existProduct) {
        throw new Error(`El producto con id: ${id}, no existe`)
    }
}


export {
    emailExists,
    existCategorieByID,
    existProductByID,
    existUserByID,
    isValidRole,
}