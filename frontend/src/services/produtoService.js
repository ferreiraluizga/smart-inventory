import { api } from "../api/api"

export const produtoService = {
    
    async salvar(nome, descricao, preco, quantidade, ativo, fornecedorId, categoriaId, marcaId) {
        const response = await api.post(
            "/produtos",
            {
                nome,
                descricao,
                preco,
                quantidade,
                ativo,
                fornecedorId,
                categoriaId,
                marcaId
            }
        );

        return response.data;
    },

    async atualizar(id, nome, descricao, preco, quantidade, ativo, fornecedorId, categoriaId, marcaId) {
        const response = await api.put(
            `/produtos/${id}`,
            {
                nome,
                descricao,
                preco,
                quantidade,
                ativo,
                fornecedorId,
                categoriaId,
                marcaId
            }
        );

        return response.data;
    },

    async excluir(id) {
        const response = await api.delete(
            `/produtos/${id}`
        );

        return response.data;
    },

    async listarTodos() {
        const response = await api.get(
            "/produtos"
        );

        return response.data;
    },

    async buscarPorId(id) {
        const response = await api.get(
            `/produtos/${id}`
        );

        return response.data;
    },

    async buscarEstoqueBaixo() {
        const response = await api.get(
            "/produtos/estoque-baixo"
        );

        return response.data;
    },

    async buscarAtivos() {
        const response = await api.get(
            "/produtos/ativos"
        );

        return response.data;
    }
}