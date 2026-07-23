package com.ferreiraluizga.smartinventory.service;

import com.ferreiraluizga.smartinventory.dto.request.CategoriaRequest;
import com.ferreiraluizga.smartinventory.dto.response.CategoriaResponse;
import com.ferreiraluizga.smartinventory.dto.response.ProdutoResponse;
import com.ferreiraluizga.smartinventory.entity.Categoria;
import com.ferreiraluizga.smartinventory.entity.Produto;
import com.ferreiraluizga.smartinventory.mapper.CategoriaMapper;
import com.ferreiraluizga.smartinventory.mapper.ProdutoMapper;
import com.ferreiraluizga.smartinventory.repository.CategoriaRepository;
import com.ferreiraluizga.smartinventory.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    private final ProdutoRepository produtoRepository;

    private final CategoriaMapper categoriaMapper;

    private final ProdutoMapper produtoMapper;

    @Transactional
    public CategoriaResponse salvar(CategoriaRequest dto) {
        if (categoriaRepository.existsByNome(dto.nome())) {
            throw new RuntimeException("Já existe uma categoria com esse nome");
        }

        Categoria c = categoriaMapper.toEntity(dto);
        return categoriaMapper.toResponse(categoriaRepository.save(c));
    }

    @Transactional
    public CategoriaResponse atualizar(CategoriaRequest dto, Long id) {
        Categoria c = categoriaMapper.toEntity(dto);
        c.setId(id);
        return categoriaMapper.toResponse(categoriaRepository.save(c));
    }

    @Transactional
    public void excluir(Long id) {
        categoriaRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarTodos() {
        List<Categoria> categorias = categoriaRepository.findAll();
        return categorias.stream()
                .map(categoria -> {
                    long qtd =  produtoRepository.countByCategoria_Id(categoria.getId());
                    return categoriaMapper.toResponse(categoria);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoriaResponse buscarPorId(Long id) {
        Categoria c = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        long qtd = produtoRepository.countByCategoria_Id(id);
        return categoriaMapper.toResponse(c, qtd);
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponse> listarProdutosPorCategoria(Long categoriaId) {
        List<Produto> produtos = produtoRepository.findByCategoria_Id(categoriaId);
        return produtos.stream()
                .map(produtoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Long buscarTotal() {
        return categoriaRepository.count();
    }

}
