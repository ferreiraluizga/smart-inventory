package com.ferreiraluizga.smartinventory.dto.response;

import com.ferreiraluizga.smartinventory.entity.enums.StatusPagamento;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public record PedidoResponse(

        Long id,
        Long fornecedorId,
        String fornecedorNome,
        double total,
        LocalDateTime dataPedido,
        Date dataVencimento,
        Date dataPagamento,
        StatusPagamento status,
        List<ItemPedidoResponse> itens

) { }
