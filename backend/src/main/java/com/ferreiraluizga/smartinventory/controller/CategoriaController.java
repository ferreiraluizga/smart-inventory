package com.ferreiraluizga.smartinventory.controller;

import com.ferreiraluizga.smartinventory.dto.request.CategoriaRequest;
import com.ferreiraluizga.smartinventory.dto.response.CategoriaResponse;
import com.ferreiraluizga.smartinventory.dto.response.ProdutoResponse;
import com.ferreiraluizga.smartinventory.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @PostMapping
    public ResponseEntity<CategoriaResponse> salvar(@Valid @RequestBody CategoriaRequest dto) {
        CategoriaResponse response = categoriaService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> atualizar(@Valid @RequestBody CategoriaRequest dto, @PathVariable Long id) {
        CategoriaResponse response = categoriaService.atualizar(dto, id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        categoriaService.excluir(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> listarTodos() {
        List<CategoriaResponse> response = categoriaService.listarTodos();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponse> buscarPorId(@PathVariable Long id) {
        CategoriaResponse response = categoriaService.buscarPorId(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}/produtos")
    public ResponseEntity<List<ProdutoResponse>> listarProdutosPorCategoria(@PathVariable Long id) {
        List<ProdutoResponse> response = categoriaService.listarProdutosPorCategoria(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
