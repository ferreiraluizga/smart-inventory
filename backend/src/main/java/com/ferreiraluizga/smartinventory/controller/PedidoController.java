package com.ferreiraluizga.smartinventory.controller;

import com.ferreiraluizga.smartinventory.dto.request.PedidoRequest;
import com.ferreiraluizga.smartinventory.dto.response.PedidoResponse;
import com.ferreiraluizga.smartinventory.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoResponse> salvar(@Valid @RequestBody PedidoRequest dto) {
        PedidoResponse response = pedidoService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/registrar-pagamento")
    public ResponseEntity<PedidoResponse> registrarPagamento(@PathVariable Long id) {
        PedidoResponse response = pedidoService.registrarPagamento(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        pedidoService.excluir(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponse>> listarTodos() {
        List<PedidoResponse> response = pedidoService.listarTodos();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> buscarPorId(@PathVariable Long id) {
        PedidoResponse response = pedidoService.buscarPorId(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
