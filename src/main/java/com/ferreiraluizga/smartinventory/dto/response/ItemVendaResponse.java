package com.ferreiraluizga.smartinventory.dto.response;

public record ItemVendaResponse(

        Long produtoId,
        String nomeProduto,
        int quant,
        double subtotal

) { }
