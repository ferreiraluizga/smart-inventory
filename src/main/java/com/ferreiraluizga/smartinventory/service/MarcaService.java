package com.ferreiraluizga.smartinventory.service;

import com.ferreiraluizga.smartinventory.dto.request.MarcaRequest;
import com.ferreiraluizga.smartinventory.dto.response.MarcaResponse;
import com.ferreiraluizga.smartinventory.entity.Marca;
import com.ferreiraluizga.smartinventory.mapper.MarcaMapper;
import com.ferreiraluizga.smartinventory.repository.MarcaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class MarcaService {

    private final MarcaRepository marcaRepository;

    private final MarcaMapper marcaMapper;

    public MarcaResponse salvar(MarcaRequest dto) {
        Marca m = marcaMapper.toEntity(dto);
        return marcaMapper.toResponse(marcaRepository.save(m));
    }

    public MarcaResponse atualizar(MarcaRequest dto, Long id) {
        Marca m = marcaMapper.toEntity(dto);
        m.setId(id);
        return marcaMapper.toResponse(marcaRepository.save(m));
    }

    public void excluir(Long id) {
        marcaRepository.deleteById(id);
    }

    public List<MarcaResponse> listarTodos() {
        List<Marca> marcas = marcaRepository.findAll();
        return marcas.stream()
                .map(marcaMapper::toResponse)
                .collect(Collectors.toList());
    }
}
