package com.ferreiraluizga.smartinventory.dto.request;

import jakarta.validation.constraints.NotBlank;

public record MarcaRequest(

        @NotBlank(message = "A marca precisa ter um nome")
        String nome

) { }
