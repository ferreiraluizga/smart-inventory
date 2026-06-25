package com.ferreiraluizga.smartinventory.service;

import com.ferreiraluizga.smartinventory.dto.request.FornecedorRequest;
import com.ferreiraluizga.smartinventory.dto.response.FornecedorResponse;
import com.ferreiraluizga.smartinventory.entity.Fornecedor;
import com.ferreiraluizga.smartinventory.mapper.FornecedorMapper;
import com.ferreiraluizga.smartinventory.repository.FornecedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FornecedorService {

    private final FornecedorRepository fornecedorRepository;

    private final FornecedorMapper fornecedorMapper;

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
        // 1. Verifica se o fornecedor existe antes de tentar atualizar
        Fornecedor fornecedorExistente = fornecedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado com o ID: " + id));

        // 2. Valida se o CNPJ já está sendo usado por OUTRO fornecedor
        fornecedorRepository.findByCnpj(dto.cnpj()).ifPresent(f -> {
            if (!f.getId().equals(id)) {
                throw new RuntimeException("Já existe um fornecedor com o mesmo CNPJ");
            }
        });

        // 3. Valida se o e-mail já está sendo usado por OUTRO fornecedor
        fornecedorRepository.findByEmail(dto.email()).ifPresent(f -> {
            if (!f.getId().equals(id)) {
                throw new RuntimeException("Já existe um fornecedor com o mesmo email");
            }
        });

        // 4. Mapeia e salva as alterações
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
                .map(fornecedorMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FornecedorResponse buscarPorId(Long id) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado"));
        return fornecedorMapper.toResponse(fornecedor);
    }

    @Transactional(readOnly = true)
    public List<FornecedorResponse> buscarPorNome(String nome) {
        List<Fornecedor> fornecedores = fornecedorRepository.findByNome(nome);
        return fornecedores.stream()
                .map(fornecedorMapper::toResponse)
                .collect(Collectors.toList());
    }

}
