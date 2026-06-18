package com.ferreiraluizga.smartinventory.controller;

import com.ferreiraluizga.smartinventory.dto.request.FornecedorRequest;
import com.ferreiraluizga.smartinventory.dto.response.FornecedorResponse;
import com.ferreiraluizga.smartinventory.service.FornecedorService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/fornecedores")
public class FornecedorController {

    private final FornecedorService fornecedorService;

    @PostMapping
    public ResponseEntity<FornecedorResponse> salvar(@Valid @RequestBody FornecedorRequest dto) {
        FornecedorResponse response = fornecedorService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FornecedorResponse> atualizar(@Valid @RequestBody FornecedorRequest dto, @PathVariable Long id) {
        FornecedorResponse response = fornecedorService.atualizar(dto, id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        fornecedorService.excluir(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping
    public ResponseEntity<List<FornecedorResponse>> listarTodos() {
        List<FornecedorResponse> response = fornecedorService.listarTodos();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FornecedorResponse> buscarPorId(@PathVariable Long id) {
        FornecedorResponse response = fornecedorService.buscarPorId(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<FornecedorResponse>> buscarPorNome(@RequestParam String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<FornecedorResponse> response = fornecedorService.buscarPorNome(nome.trim());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
