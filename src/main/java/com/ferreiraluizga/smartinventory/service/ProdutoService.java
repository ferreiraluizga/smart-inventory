package com.ferreiraluizga.smartinventory.service;

import com.ferreiraluizga.smartinventory.dto.request.ProdutoRequest;
import com.ferreiraluizga.smartinventory.dto.response.ProdutoResponse;
import com.ferreiraluizga.smartinventory.entity.Produto;
import com.ferreiraluizga.smartinventory.mapper.ProdutoMapper;
import com.ferreiraluizga.smartinventory.repository.ProdutoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    private final ProdutoMapper produtoMapper;

    public ProdutoResponse salvar(ProdutoRequest dto) {
        Produto p = produtoMapper.toEntity(dto);
        return produtoMapper.toResponse(produtoRepository.save(p));
    }

}
