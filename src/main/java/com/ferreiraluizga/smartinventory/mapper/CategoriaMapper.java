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
                c.getDescricao()
        );
    }

    public Categoria toEntity(CategoriaRequest dto) {
        Categoria c = new Categoria();
        c.setNome(dto.nome());
        c.setNome(dto.descricao());
        return c;
    }

}
