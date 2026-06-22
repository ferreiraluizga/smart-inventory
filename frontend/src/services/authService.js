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