package com.ferreiraluizga.smartinventory.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Date;
import java.util.List;

public record PedidoRequest(

        @NotNull(message = "O pedido precisa ter um fornecedor")
        Long fornecedorId,

        @NotNull(message = "O pedido precisa ter um vencimento para o pagamento")
        Date dataVencimento,

        Date dataPagamento,

        @NotEmpty(message = "A lista de itens não pode ser vazia")
        List<ItemPedidoRequest> itens

) { }
