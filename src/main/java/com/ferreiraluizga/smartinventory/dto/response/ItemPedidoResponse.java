package com.ferreiraluizga.smartinventory.dto.response;

public record ItemPedidoResponse(

        Long produtoId,
        String nomeProduto,
        int quant,
        double subtotal

) { }
