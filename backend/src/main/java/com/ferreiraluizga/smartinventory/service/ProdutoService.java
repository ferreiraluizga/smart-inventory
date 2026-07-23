package com.ferreiraluizga.smartinventory.service;

import com.ferreiraluizga.smartinventory.dto.request.ProdutoRequest;
import com.ferreiraluizga.smartinventory.dto.response.ProdutoResponse;
import com.ferreiraluizga.smartinventory.entity.Produto;
import com.ferreiraluizga.smartinventory.mapper.ProdutoMapper;
import com.ferreiraluizga.smartinventory.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    private final ProdutoMapper produtoMapper;

    @Transactional
    public ProdutoResponse salvar(ProdutoRequest dto) {
        Produto p = produtoMapper.toEntity(dto);
        return produtoMapper.toResponse(produtoRepository.save(p));
    }

    @Transactional
    public ProdutoResponse atualizar(ProdutoRequest dto, Long id) {
        if(!produtoRepository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado");
        }

        Produto p = produtoMapper.toEntity(dto);
        p.setId(id);
        return produtoMapper.toResponse(produtoRepository.save(p));
    }

    @Transactional
    public void excluir(Long id) {
        produtoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponse> listarTodos() {
        List<Produto> produtos = produtoRepository.findAll();
        return produtos.stream()
                .map(produtoMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProdutoResponse buscarPorId(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        return produtoMapper.toResponse(produto);
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponse> buscarPorNome(String nome) {
        List<Produto> produtos = produtoRepository.findProdutoByNomeContainingIgnoreCaseOrderByNomeAsc(nome);
        return produtos.stream()
                .map(produtoMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponse> listarAtivos() {
        List<Produto> produtos = produtoRepository.findAllByAtivo(true);
        return produtos.stream()
                .map(produtoMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponse> buscarEstoqueBaixo() {
        List<Produto> produtos = produtoRepository.findAllByQuantidadeLessThan(10); // exemplo: mínimo de 10 unidades
        return produtos.stream()
                .map(produtoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Long buscarTotalEstoque() {
        return produtoRepository.somarTotalEstoque();
    }

}
