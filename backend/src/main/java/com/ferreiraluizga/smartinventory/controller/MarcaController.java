package com.ferreiraluizga.smartinventory.controller;

import com.ferreiraluizga.smartinventory.dto.request.MarcaRequest;
import com.ferreiraluizga.smartinventory.dto.response.MarcaResponse;
import com.ferreiraluizga.smartinventory.entity.Marca;
import com.ferreiraluizga.smartinventory.service.MarcaService;
import jakarta.validation.Valid;
import jdk.dynalink.linker.LinkerServices;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/marcas")
public class MarcaController {

    private final MarcaService marcaService;

    @PostMapping
    public ResponseEntity<MarcaResponse> salvar(@Valid @RequestBody MarcaRequest dto) {
        MarcaResponse response = marcaService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MarcaResponse> atualizar(@Valid @RequestBody MarcaRequest dto, @PathVariable Long id) {
        MarcaResponse response = marcaService.atualizar(dto, id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        marcaService.excluir(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping
    public ResponseEntity<List<MarcaResponse>> listarTodos() {
        List<MarcaResponse> response = marcaService.listarTodos();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MarcaResponse> buscarPorId(@PathVariable Long id) {
        MarcaResponse response =  marcaService.buscarPorId(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
