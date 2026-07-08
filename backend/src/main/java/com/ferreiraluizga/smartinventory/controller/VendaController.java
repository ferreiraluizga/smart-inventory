package com.ferreiraluizga.smartinventory.controller;

import com.ferreiraluizga.smartinventory.dto.request.VendaRequest;
import com.ferreiraluizga.smartinventory.dto.response.VendaResponse;
import com.ferreiraluizga.smartinventory.service.VendaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vendas")
@RequiredArgsConstructor
public class VendaController {

    private final VendaService vendaService;

    @PostMapping
    public ResponseEntity<VendaResponse> salvar(@Valid @RequestBody VendaRequest dto) {
        VendaResponse response = vendaService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        vendaService.excluir(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping
    public ResponseEntity<List<VendaResponse>> listarTodos() {
        List<VendaResponse> response = vendaService.listarTodos();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendaResponse> buscarPorId(@PathVariable Long id) {
        VendaResponse response = vendaService.buscarPorId(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/faturamento")
    public ResponseEntity<Map<String, Double>> calcularFaturamentoPorPeriodo(@RequestParam String periodo) {
        Double faturamento = vendaService.calcularFaturamentoPorPeriodo(periodo);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("total", faturamento));
    }

}
