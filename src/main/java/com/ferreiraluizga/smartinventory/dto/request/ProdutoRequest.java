package com.ferreiraluizga.smartinventory.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProdutoRequest(

        @NotBlank(message = "O nome do produto é obrigatório")
        String nome,

        String descricao,

        @NotNull(message = "O preço do produto é obrigatório")
        @DecimalMin(value = "0.0", inclusive = false, message = "O preço do produto deve ser maior que zero")
        Double preco,

        @NotNull(message = "A quantidade do produto é obrigatória")
        @Min(value = 0, message = "A quantidade do produto não pode ser negativa")
        Integer quantidade,

        Boolean ativo,

        @NotNull(message = "O produto precisa de um fornecedor")
        Long fornecedorId,

        @NotNull(message = "O produto precisa de uma categoria")
        Long categoriaId,

        @NotNull(message = "O produto precisa de uma marca")
        Long marcaId
) {}
