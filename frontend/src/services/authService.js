import { api } from "../api/api";

export const authService = {

    async login(email, senha) {
        const response = await api.post(
            "/auth/login",
            {
                email, 
                senha
            }
        );

        if (response.data && response.data.token) {
            localStorage.setItem("token", response.data.token);
        }

        return response.data;
    },

    async register(nome, email, senha, dataNasc, cpf) {
        const response = await api.post(
            "/auth/registrar",
            {
                nome,
                email,
                senha,
                dataNasc,
                cpf
            }
        );

        if (response.status === 201) {
            await this.login(email, senha);
        }

        return response.data;
    },

    logout() {
        localStorage.removeItem("token");
    },

    getToken() {
        return localStorage.getItem("token");
    },

    isAuthenticated() {
        return !!localStorage.getItem("token");
    }

}