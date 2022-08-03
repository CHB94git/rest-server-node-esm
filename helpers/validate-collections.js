const allowedCollections = (collection = '', collections = []) => {
    const includeCollection = collections.includes(collection)

    if (!includeCollection) {
        throw new Error(`La colección ${collection} no es permitida, colecciones admitidas: ${collections}`)
    }
    return true
}


export { allowedCollections }