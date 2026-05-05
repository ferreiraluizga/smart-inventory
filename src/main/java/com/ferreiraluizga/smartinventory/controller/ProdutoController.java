package com.ferreiraluizga.smartinventory.controller;

import com.ferreiraluizga.smartinventory.dto.request.ProdutoRequest;
import com.ferreiraluizga.smartinventory.dto.response.ProdutoResponse;
import com.ferreiraluizga.smartinventory.service.ProdutoService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private final ProdutoService produtoService;

    @PostMapping("/salvar")
    public ResponseEntity<ProdutoResponse> salvar(@RequestBody ProdutoRequest dto) {
         ProdutoResponse response = produtoService.salvar(dto);
         return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}