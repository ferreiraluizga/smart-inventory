package com.ferreiraluizga.smartinventory.service;

import com.ferreiraluizga.smartinventory.dto.request.FornecedorRequest;
import com.ferreiraluizga.smartinventory.dto.response.FornecedorResponse;
import com.ferreiraluizga.smartinventory.dto.response.ProdutoResponse;
import com.ferreiraluizga.smartinventory.entity.Fornecedor;
import com.ferreiraluizga.smartinventory.entity.Produto;
import com.ferreiraluizga.smartinventory.mapper.FornecedorMapper;
import com.ferreiraluizga.smartinventory.mapper.ProdutoMapper;
import com.ferreiraluizga.smartinventory.repository.FornecedorRepository;
import com.ferreiraluizga.smartinventory.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FornecedorService {

    private final FornecedorRepository fornecedorRepository;

    private final ProdutoRepository produtoRepository;

    private final FornecedorMapper fornecedorMapper;

    private final ProdutoMapper produtoMapper;

    @Transactional
    public FornecedorResponse salvar(FornecedorRequest dto) {
        if (fornecedorRepository.existsByCnpj(dto.cnpj())) {
            throw new RuntimeException("Já existe um fornecedor com o mesmo CNPJ");
        }

        if (fornecedorRepository.existsByEmail(dto.email())) {
            throw new RuntimeException("Já existe um fornecedor com o mesmo email");
        }

        Fornecedor f = fornecedorMapper.toEntity(dto);
        return fornecedorMapper.toResponse(fornecedorRepository.save(f));
    }

    @Transactional
    public FornecedorResponse atualizar(FornecedorRequest dto, Long id) {
        Fornecedor f = fornecedorMapper.toEntity(dto);
        f.setId(id);
        return fornecedorMapper.toResponse(fornecedorRepository.save(f));
    }

    @Transactional
    public void excluir(Long id) {
        fornecedorRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<FornecedorResponse> listarTodos() {
        List<Fornecedor> fornecedores = fornecedorRepository.findAll();
        return fornecedores.stream()
                .map(fornecedor -> {
                    long qtd = produtoRepository.countByFornecedor_Id(fornecedor.getId());
                    return fornecedorMapper.toResponse(fornecedor, qtd);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FornecedorResponse buscarPorId(Long id) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado"));
        long qtd = produtoRepository.countByFornecedor_Id(id);
        return fornecedorMapper.toResponse(fornecedor, qtd);
    }

    @Transactional(readOnly = true)
    public List<FornecedorResponse> buscarPorNome(String nome) {
        List<Fornecedor> fornecedores = fornecedorRepository.findByNome(nome);
        return fornecedores.stream()
                .map(fornecedorMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponse> listarProdutosPorFornecedor(Long fornecedorId) {
        List<Produto> produtos = produtoRepository.findByFornecedor_Id(fornecedorId);
        return produtos.stream()
                .map(produtoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Long buscarTotal() {
        return fornecedorRepository.count();
    }

}
