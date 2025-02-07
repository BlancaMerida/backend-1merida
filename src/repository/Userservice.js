// src/services/User.service.js
import { UserManager } from "../dao/userManager.js";
import { comparaPassword, generaHash } from "../utils/utils.js";

class UserService {
    constructor(DAO) {
        this.userDAO = DAO;
    }

    async createUser(userData) {
        return await this.userDAO.create(userData);
    }
    
    async updatePassword(userId, oldPassword, newPassword) {
        const user = await this.userDAO.getBy({ _id: userId });
        if (!user) {
            throw new Error("Usuario no encontrado.");
        }

        const isMatch = await comparaPassword(oldPassword, user.password);
        if (!isMatch) {
            throw new Error("La contraseña actual no es correcta.");
        }

        const hashedNewPassword = await generaHash(newPassword);
        return await this.userDAO.update(userId, { password: hashedNewPassword });
    }

    async getUserBy(filter = {}) {
        return await this.userDAO.getBy(filter);
    }

    async initializeAdmin() {
        const adminCreated = await this.userDAO.crearAdminInicial();
        if (adminCreated) {
            console.log("Usuario rol admin creado con éxito.");
        } else {
            console.log("El usuario rol admin ya existe.");
        }
        return adminCreated;
    }
    async updateUser(userId, data) {
        return await this.userDAO.update(userId, data);
    }
}

export const userService = new UserService(UserManager);