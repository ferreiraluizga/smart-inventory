package com.ferreiraluizga.smartinventory.service;

import com.ferreiraluizga.smartinventory.dto.request.ItemVendaRequest;
import com.ferreiraluizga.smartinventory.dto.request.VendaRequest;
import com.ferreiraluizga.smartinventory.dto.response.VendaResponse;
import com.ferreiraluizga.smartinventory.entity.ItemVenda;
import com.ferreiraluizga.smartinventory.entity.Produto;
import com.ferreiraluizga.smartinventory.entity.Venda;
import com.ferreiraluizga.smartinventory.mapper.VendaMapper;
import com.ferreiraluizga.smartinventory.repository.ProdutoRepository;
import com.ferreiraluizga.smartinventory.repository.VendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class VendaService {

    private final VendaRepository vendaRepository;

    private final ProdutoRepository produtoRepository;

    private final VendaMapper vendaMapper;

    @Transactional
    public VendaResponse salvar(VendaRequest dto) {
        Venda v = new Venda();
        v.setDataVenda(LocalDateTime.now());
        v.setFormaPagamento(dto.formaPagamento());

        List<ItemVenda> itens = new ArrayList<>();

        double total = 0.0;

        for (ItemVendaRequest itemRequest : dto.itens()) {
            Produto p = produtoRepository.findById(itemRequest.produtoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemRequest.produtoId()));

            if (!p.getAtivo()) {
                throw new RuntimeException("Produto inativo: " + p.getNome());
            }

            if (p.getQuantidade() < itemRequest.quant()) {
                throw new RuntimeException("Quantidade insuficiente para o produto: " + p.getNome());
            }

            double subtotal = p.getPreco() * itemRequest.quant();

            ItemVenda item = new ItemVenda();
            item.setProduto(p);
            item.setQuant(itemRequest.quant());
            item.setSubtotal(subtotal);
            item.setVenda(v);

            itens.add(item);

            total += subtotal;

            p.setQuantidade(p.getQuantidade() - itemRequest.quant());
        }

        v.setItens(itens);
        v.setTotal(total);

        return vendaMapper.toResponse(vendaRepository.save(v));
    }

    @Transactional
    public void excluir(Long id) {
        Venda v = vendaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venda não encontrada"));

        for (ItemVenda item : v.getItens()) {
            Produto p = item.getProduto();
            p.setQuantidade(p.getQuantidade() + item.getQuant());
        }

        vendaRepository.delete(v);
    }

    @Transactional(readOnly = true)
    public List<VendaResponse> listarTodos() {
        List<Venda> vendas = vendaRepository.findAll();
        return vendas.stream()
                .map(vendaMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VendaResponse buscarPorId(Long id) {
        Venda v = vendaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venda não encontrada"));

        return vendaMapper.toResponse(v);
    }

    public Double calcularFaturamentoPorPeriodo(String periodo) {
        LocalDateTime inicio;

        switch (periodo) {
            case "hoje" -> inicio = LocalDate.now().atStartOfDay();
            case "ultimos30dias" -> inicio = LocalDateTime.now().minusDays(30);
            case "mensal" -> inicio = LocalDate.now().withDayOfMonth(1).atStartOfDay();
            default -> inicio = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        }

        return vendaRepository.calcularFaturamentoPorPeriodo(inicio);
    }

}
