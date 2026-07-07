package com.ferreiraluizga.smartinventory.dto.response;

public record FornecedorResponse(

        Long id,
        String nome,
        String cnpj,
        String email,
        Long quantidadeProdutos

) { }
