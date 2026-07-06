package com.ferreiraluizga.smartinventory.mapper;

import com.ferreiraluizga.smartinventory.dto.request.CategoriaRequest;
import com.ferreiraluizga.smartinventory.dto.response.CategoriaResponse;
import com.ferreiraluizga.smartinventory.entity.Categoria;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {

    public CategoriaResponse toResponse(Categoria c) {
        return new CategoriaResponse(
                c.getId(),
                c.getNome(),
                c.getDescricao(),
                0L
        );
    }

    public CategoriaResponse toResponse(Categoria c, Long quantidadeProdutos) {
        return new CategoriaResponse(
                c.getId(),
                c.getNome(),
                c.getDescricao(),
                quantidadeProdutos != null ? quantidadeProdutos : 0L
        );
    }

    public Categoria toEntity(CategoriaRequest dto) {
        Categoria c = new Categoria();
        c.setNome(dto.nome());
        c.setDescricao(dto.descricao());
        return c;
    }

}
