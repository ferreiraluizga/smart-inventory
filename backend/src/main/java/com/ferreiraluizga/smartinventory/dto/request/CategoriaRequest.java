package com.ferreiraluizga.smartinventory.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CategoriaRequest(

        @NotBlank(message = "A categoria precisa ter um nome")
        String nome,

        @NotBlank(message = "A categoria precisa ter uma descrição")
        String descricao

) { }
