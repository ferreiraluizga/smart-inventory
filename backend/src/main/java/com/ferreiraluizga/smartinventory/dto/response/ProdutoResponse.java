package com.ferreiraluizga.smartinventory.dto.response;

public record ProdutoResponse(

        Long id,
        String nome,
        String descricao,
        Double preco,
        Integer quantidade,
        Boolean ativo,
        Long fornecedorId,
        String fornecedorNome,
        Long categoriaId,
        String categoriaNome,
        Long marcaId,
        String marcaNome

) {}
