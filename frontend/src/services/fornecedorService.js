import { api } from "../api/api"

export const fornecedorService = {

    async salvar(nome, cnpj, email) {
        const response = await api.post(
            "/fornecedores",
            {
                nome,
                cnpj,
                email
            }
        );

        return response.data;
    },

    async atualizar(id, nome, cnpj, email) {
        const response = await api.put(
            `/fornecedores/${id}`,
            {
                nome,
                cnpj,
                email
            }
        );

        return response.data;
    },

    async excluir(id) {
        const response = await api.delete(
            `/fornecedores/${id}`
        );

        return response.data;
    },

    async listarTodos() {
        const response = await api.get(
            `/fornecedores`
        );

        return response.data;
    },

    async buscarPorId(id) {
        const response = await api.get(
            `/fornecedores/${id}`
        );

        return response.data;
    }

}