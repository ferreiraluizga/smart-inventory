import { api } from "../api/api"

export const categoriaService = {

    async salvar(nome, descricao) {
        const response = await api.post(
            "/categorias",
            {
                nome,
                descricao
            }
        );

        return response.data;
    },

    async atualizar(id, nome, descricao) {
        const response = await api.put(
            `/categorias/${id}`,
            {
                nome,
                descricao
            }
        );

        return response.data;
    },

    async excluir(id) {
        const response = await api.delete(
            `/categorias/${id}`
        );

        return response.data;
    },

    async listarTodos() {
        const response = await api.get(
            "/categorias"
        );

        return response.data;
    },

    async buscarPorId(id) {
        const response = await api.get(
            `/categorias/${id}`
        );

        return response.data;
    }

}