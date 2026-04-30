package com.ferreiraluizga.smartinventory.mapper;

import com.ferreiraluizga.smartinventory.dto.request.ProdutoRequest;
import com.ferreiraluizga.smartinventory.dto.response.ProdutoResponse;
import com.ferreiraluizga.smartinventory.entity.Produto;
import org.springframework.stereotype.Component;

@Component
public class ProdutoMapper {

    public ProdutoResponse toResponse(Produto p) {
        return new ProdutoResponse(
                p.getId(),
                p.getNome(),
                p.getDescricao(),
                p.getPreco(),
                p.getQuantidade(),
                p.getAtivo()
        );
    }

    public Produto toEntity(ProdutoRequest dto) {
        Produto p = new Produto();
        p.setNome(dto.nome());
        p.setDescricao(dto.descricao());
        p.setPreco(dto.preco());
        p.setQuantidade(dto.quantidade());
        p.setAtivo(dto.ativo());
        return p;
    }

}
