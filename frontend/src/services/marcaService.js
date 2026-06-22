import { api } from "../api/api"

export const marcaService =  {
    
    async salvar(nome) {
        const response = await api.post(
            "/marcas",
            {
                nome
            }
        );

        return response.data;
    },

    async atualizar(id, nome) {
        const response = await api.put(
            `/marcas/${id}`,
            {
                nome
            }
        );

        return response.data;
    },

    async excluir(id) {
        const response = await api.delete(
            `/marcas/${id}`
        );

        return response.data;
    },

    async listarTodos() {
        const response = await api.get(
            "/marcas"
        );

        return response.data;
    }
}