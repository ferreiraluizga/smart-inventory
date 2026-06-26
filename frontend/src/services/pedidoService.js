import { api } from "../api/api"

export const pedidoService = {

    async salvar(fornecedorId, dataVencimento, dataPagamento) {
        const response = await api.post(
            "/pedidos",
            {
                fornecedorId, 
                dataVencimento, 
                dataPagamento, 
                itens
            }
        );

        return response.data;
    },

    async registrarPagamento(id, dataPagamento) {
        const response = await api.put(
            `/pedidos/${id}/registrar-pagamento`,
            {
                dataPagamento
            }
        );

        return response.data;
    },
    
    async excluir(id) {
        const response = await api.delete(
            `/pedidos/${id}`
        );
        
        return response.data;
    },

    async listarTodos() {
        const response = await api.get(
            "/pedidos"
        );

        return response.data;
    },

    async buscarPorId(id) {
        const response = await api.get(
            `/pedidos/${id}`
        );

        return response.data;
    }

}