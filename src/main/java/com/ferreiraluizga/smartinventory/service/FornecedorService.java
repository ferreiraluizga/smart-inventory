package com.ferreiraluizga.smartinventory.service;

import com.ferreiraluizga.smartinventory.dto.request.FornecedorRequest;
import com.ferreiraluizga.smartinventory.dto.response.FornecedorResponse;
import com.ferreiraluizga.smartinventory.entity.Fornecedor;
import com.ferreiraluizga.smartinventory.mapper.FornecedorMapper;
import com.ferreiraluizga.smartinventory.repository.FornecedorRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FornecedorService {

    private final FornecedorRepository fornecedorRepository;

    private final FornecedorMapper fornecedorMapper;

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

    public FornecedorResponse atualizar(FornecedorRequest dto, Long id) {
        Fornecedor f = fornecedorMapper.toEntity(dto);
        f.setId(id);
        return fornecedorMapper.toResponse(fornecedorRepository.save(f));
    }

    public void excluir(Long id) {
        fornecedorRepository.deleteById(id);
    }

    public List<FornecedorResponse> listarTodos() {
        List<Fornecedor> fornecedores = fornecedorRepository.findAll();
        return fornecedores.stream()
                .map(fornecedorMapper::toResponse)
                .collect(Collectors.toList());
    }

    public FornecedorResponse buscarPorId(Long id) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado"));
        return fornecedorMapper.toResponse(fornecedor);
    }

    public List<FornecedorResponse> buscarPorNome(String nome) {
        List<Fornecedor> fornecedores = fornecedorRepository.findByNome(nome);
        return fornecedores.stream()
                .map(fornecedorMapper::toResponse)
                .collect(Collectors.toList());
    }

}
