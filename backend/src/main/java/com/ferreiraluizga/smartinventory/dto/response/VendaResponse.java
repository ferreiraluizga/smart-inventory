package com.ferreiraluizga.smartinventory.dto.response;

import com.ferreiraluizga.smartinventory.entity.enums.FormaPagamento;

import java.time.LocalDateTime;
import java.util.List;

public record VendaResponse(

        Long id,
        LocalDateTime dataVenda,
        double total,
        FormaPagamento formaPagamento,
        List<ItemVendaResponse> itens

) { }
