package com.ferreiraluizga.smartinventory.dto.request;

import com.ferreiraluizga.smartinventory.entity.enums.FormaPagamento;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record VendaRequest(

        @NotNull(message = "A forma de pagamento é obrigatória")
        FormaPagamento formaPagamento,

        @NotEmpty(message = "A lista de itens não pode ser vazia")
        List<ItemVendaRequest> itens

) { }
