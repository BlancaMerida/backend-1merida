import { usersModel } from "./models/user.model.js";
import { generaHash } from "../utils/utils.js";

export class UserManager {
    static async create(usuario = {}) {
        const nuevoUsuario = await usersModel.create(usuario);
        return nuevoUsuario.toJSON();
    }

    static async getBy(filtro={}) {
        return await usersModel.findOne(filtro).lean();
    }

    static async crearAdminInicial() {
        const adminExistente = await usersModel.findOne({ email: 'adminCoder@coder.com' }).lean();
        if (!adminExistente) {
            const admin = {
                first_name: 'admin',
                email: 'adminCoder@coder.com',
                password: await generaHash('adminCod3r123'),
                role: 'admin'
            };
            await usersModel.create(admin);
            return true;
        }
        return false; 
    }

    static async update(userId, data){
        try {
            return await usersModel.findByIdAndUpdate(userId, data, { new: true });
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            throw error;
        }
    }
}