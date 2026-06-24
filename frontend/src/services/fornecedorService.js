import { api } from "../api/api"

const fornecedorService = {

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

    },

    async listarTodos() {

    },

    async buscarPorId(id) {

    }

}