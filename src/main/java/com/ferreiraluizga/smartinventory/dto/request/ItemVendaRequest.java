package com.ferreiraluizga.smartinventory.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ItemVendaRequest(

        @NotNull(message = "O produto é obrigatório")
        Long produtoId,

        @Min(value = 1, message = "A quantidade deve ser no mínimo 1")
        int quant

) { }
