import { api } from "../api/api.js";

export const vendaService = {

    async salvar(formaPagamento, itens) {
        const response = await api.post(
            "/vendas",
            {
                formaPagamento,
                itens
            }
        );

        return response.data;
    },

    async excluir(id) {
        const response = await api.delete(
            `/vendas/${id}`
        );

        return response.data;
    },

    async listarTodos() {
        const response = await api.get(
            "/vendas"
        );

        return response.data;
    },

    async buscarPorId(id) {
        const response = await api.get(
            `/vendas/${id}`
        );

        return response.data;
    },

    async calcularFaturamentoPorPeriodo(periodo) {
        const response = await api.get(
            `/vendas/faturamento`,
            {
                params: { periodo }
            }
        );

        return response.data;
    },

    async buscarTotal() {
        const response = await api.get(
            "/vendas/total"
        );

        return response.data;
    }

}
