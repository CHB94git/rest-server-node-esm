import { response } from 'express';

const validateUploadFile = (req, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            msg: 'No hay archivos para subir - Middleware - validateUploadFile'
        });
    }
    next()
}

export { validateUploadFile }