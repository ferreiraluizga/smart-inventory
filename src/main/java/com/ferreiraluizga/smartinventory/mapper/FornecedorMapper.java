package com.ferreiraluizga.smartinventory.mapper;

import com.ferreiraluizga.smartinventory.dto.response.FornecedorResponse;
import com.ferreiraluizga.smartinventory.entity.Fornecedor;
import org.springframework.stereotype.Component;

@Component
public class FornecedorMapper {

    public FornecedorResponse toResponse(Fornecedor f) {
        return new FornecedorResponse(
                f.getId(),
                f.getNome(),
                f.getCnpj(),
                f.getEmail()
        );
    }

    public Fornecedor toEntity(FornecedorResponse dto) {
        Fornecedor f = new Fornecedor();
        f.setId(dto.id());
        f.setNome(dto.nome());
        f.setCnpj(dto.cnpj());
        f.setEmail(dto.email());
        return f;
    }

}
