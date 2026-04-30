package com.ferreiraluizga.smartinventory.dto.request;

public record ProdutoRequest(String nome, String descricao, Double preco, Integer quantidade, Boolean ativo) {
}
