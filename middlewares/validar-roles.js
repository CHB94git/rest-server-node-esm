import { response } from 'express';


const isAdminRole = (req, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    }

    const { role, name } = req.usuario

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} no es administrador - No tiene los permisos para esta acción`
        })
    }
    next()
}


const haveRole = (...roles) => {
    return (req, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            })
        }

        if (!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            })
        }
        next()
    }
}

export {
    isAdminRole,
    haveRole
}