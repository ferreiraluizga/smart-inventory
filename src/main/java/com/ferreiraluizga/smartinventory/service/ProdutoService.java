package com.ferreiraluizga.smartinventory.service;

import com.ferreiraluizga.smartinventory.dto.request.ProdutoRequest;
import com.ferreiraluizga.smartinventory.dto.response.ProdutoResponse;
import com.ferreiraluizga.smartinventory.entity.Produto;
import com.ferreiraluizga.smartinventory.mapper.ProdutoMapper;
import com.ferreiraluizga.smartinventory.repository.ProdutoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    private final ProdutoMapper produtoMapper;

    public ProdutoResponse salvar(ProdutoRequest dto) {
        Produto p = produtoMapper.toEntity(dto);
        return produtoMapper.toResponse(produtoRepository.save(p));
    }

    public ProdutoResponse atualizar(ProdutoRequest dto, Long id) {
        Produto p = produtoMapper.toEntity(dto);
        p.setId(id);
        return produtoMapper.toResponse(produtoRepository.save(p));
    }

    public void excluir(Long id) {
        produtoRepository.deleteById(id);
    }

    public List<ProdutoResponse> listarTodos() {
        List<Produto> produtos = produtoRepository.findAll();
        return produtos.stream()
                .map(produtoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ProdutoResponse buscarPorId(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        return produtoMapper.toResponse(produto);
    }

    public List<ProdutoResponse> buscarPorNome(String nome) {
        List<Produto> produtos = produtoRepository.findByNome(nome);
        return produtos.stream()
                .map(produtoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProdutoResponse> listarAtivos() {
        List<Produto> produtos = produtoRepository.findAllAtivos();
        return produtos.stream()
                .map(produtoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProdutoResponse> buscarEstoqueBaixo() {
        List<Produto> produtos = produtoRepository.findEstoqueBaixo(10); // exemplo: mínimo de 10 unidades
        return produtos.stream()
                .map(produtoMapper::toResponse)
                .collect(Collectors.toList());
    }

}
