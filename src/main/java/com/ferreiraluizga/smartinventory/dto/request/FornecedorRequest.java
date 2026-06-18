package com.ferreiraluizga.smartinventory.dto.request;

import jakarta.validation.constraints.NotBlank;

public record FornecedorRequest(

        @NotBlank(message = "O nome do fornecedor é obrigatório")
        String nome,

        @NotBlank(message = "O CNPJ do fornecedor é obrigatório")
        String cnpj,

        @NotBlank(message = "O email do fornecedor é obrigatório")
        String email
) { }
