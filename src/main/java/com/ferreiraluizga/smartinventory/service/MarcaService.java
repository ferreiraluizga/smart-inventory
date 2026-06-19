package com.ferreiraluizga.smartinventory.service;

import com.ferreiraluizga.smartinventory.dto.request.MarcaRequest;
import com.ferreiraluizga.smartinventory.dto.response.MarcaResponse;
import com.ferreiraluizga.smartinventory.entity.Marca;
import com.ferreiraluizga.smartinventory.mapper.MarcaMapper;
import com.ferreiraluizga.smartinventory.repository.MarcaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarcaService {

    private final MarcaRepository marcaRepository;

    private final MarcaMapper marcaMapper;

    @Transactional
    public MarcaResponse salvar(MarcaRequest dto) {
        if (marcaRepository.existsByNome(dto.nome())) {
            throw new RuntimeException("Já existe uma marca com esse nome");
        }

        Marca m = marcaMapper.toEntity(dto);
        return marcaMapper.toResponse(marcaRepository.save(m));
    }

    @Transactional
    public MarcaResponse atualizar(MarcaRequest dto, Long id) {
        Marca m = marcaMapper.toEntity(dto);
        m.setId(id);
        return marcaMapper.toResponse(marcaRepository.save(m));
    }

    @Transactional
    public void excluir(Long id) {
        marcaRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<MarcaResponse> listarTodos() {
        List<Marca> marcas = marcaRepository.findAll();
        return marcas.stream()
                .map(marcaMapper::toResponse)
                .collect(Collectors.toList());
    }
}
