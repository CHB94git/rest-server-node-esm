import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url))


const fileUploadHelper = (files, validExtensions = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'], folder = '') => {

    return new Promise((resolve, reject) => {

        const { file } = files

        const cutName = file.name.split('.')

        // .pop() obtiene el último elemento del array(extension)
        // .pop() = [cutName.length - 1]

        const extension = cutName.pop()

        if (!validExtensions.includes(file.mimetype)) {
            return reject(`Solo extensiones ${validExtensions.join(', ')} son aceptadas`)
        }

        const tempName = uuidv4() + '.' + extension
        const uploadPath = path.join(__dirname, '../uploads/', folder, tempName);

        file.mv(uploadPath, (err) => {
            if (err) {
                reject(err)
            }
            resolve(tempName)
        });
    })
}

export { fileUploadHelper }