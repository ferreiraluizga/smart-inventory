package com.ferreiraluizga.smartinventory.controller;

import com.ferreiraluizga.smartinventory.dto.request.ProdutoRequest;
import com.ferreiraluizga.smartinventory.dto.response.ProdutoResponse;
import com.ferreiraluizga.smartinventory.service.ProdutoService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    @PostMapping("/salvar")
    public ResponseEntity<ProdutoResponse> salvar(@RequestBody ProdutoRequest dto) {
         ProdutoResponse response = produtoService.salvar(dto);
         return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<ProdutoResponse> atualizar(@RequestBody ProdutoRequest dto, @PathVariable Long id) {
        ProdutoResponse response = produtoService.atualizar(dto, id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("/excluir/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        produtoService.excluir(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping
    public ResponseEntity<List<ProdutoResponse>> listarTodos() {
        List<ProdutoResponse> response = produtoService.listarTodos();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponse> buscarPorId(@PathVariable Long id) {
        ProdutoResponse response = produtoService.buscarPorId(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProdutoResponse>> buscarPorNome(@RequestParam String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<ProdutoResponse> response = produtoService.buscarPorNome(nome.trim());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<ProdutoResponse>> listarAtivos() {
        List<ProdutoResponse> response = produtoService.listarAtivos();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/estoque-baixo")
    public ResponseEntity<List<ProdutoResponse>> buscarEstoqueBaixo() {
        List<ProdutoResponse> response = produtoService.buscarEstoqueBaixo();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}