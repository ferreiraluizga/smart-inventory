package com.ferreiraluizga.smartinventory.mapper;

import com.ferreiraluizga.smartinventory.dto.request.MarcaRequest;
import com.ferreiraluizga.smartinventory.dto.response.MarcaResponse;
import com.ferreiraluizga.smartinventory.entity.Marca;
import org.springframework.stereotype.Component;

@Component
public class MarcaMapper {

    public MarcaResponse toResponse(Marca m) {
        return new MarcaResponse(
                m.getId(),
                m.getNome()
        );
    }

    public Marca toEntity(MarcaRequest dto) {
        Marca m = new Marca();
        m.setNome(dto.nome());
        return m;
    }

}
