import mongoose from "mongoose"

export const connDB = async (url = "", db = "") => {
    try {
        await mongoose.connect(
            url,
            {
                dbName: db
            })
        console.log(`Conexión a DB establecida`)
    } catch (err) {
        console.log(`Error al conectarse con el servidor de BD: ${err.message}`)
    }
}