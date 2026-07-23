package com.ferreiraluizga.smartinventory.service;

import com.ferreiraluizga.smartinventory.dto.request.ItemPedidoRequest;
import com.ferreiraluizga.smartinventory.dto.request.ItemVendaRequest;
import com.ferreiraluizga.smartinventory.dto.request.PedidoRequest;
import com.ferreiraluizga.smartinventory.dto.response.PedidoResponse;
import com.ferreiraluizga.smartinventory.entity.*;
import com.ferreiraluizga.smartinventory.entity.enums.StatusPagamento;
import com.ferreiraluizga.smartinventory.mapper.PedidoMapper;
import com.ferreiraluizga.smartinventory.repository.PedidoRepository;
import com.ferreiraluizga.smartinventory.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjuster;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoMapper pedidoMapper;

    private final PedidoRepository pedidoRepository;

    private final ProdutoRepository produtoRepository;

    @Transactional
    public PedidoResponse salvar(PedidoRequest dto) {
        Pedido p = new Pedido();

        Fornecedor f = new Fornecedor();
        f.setId(dto.fornecedorId());
        p.setFornecedor(f);

        p.setDataPedido(LocalDateTime.now());
        p.setDataVencimento(dto.dataVencimento());

        if (dto.dataPagamento() != null) {
            p.setDataPagamento(dto.dataPagamento());
            p.setStatus(StatusPagamento.PAGO);
        } else {
            p.setStatus(StatusPagamento.PENDENTE);
        }

        List<ItemPedido> itens = new ArrayList<>();

        double total = 0.0;

        for (ItemPedidoRequest itemRequest : dto.itens()) {
            Produto produto = produtoRepository.findById(itemRequest.produtoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

            if (!produto.getAtivo()) {
                throw new RuntimeException("Produto inativo: " + produto.getNome());
            }

            double subtotal = produto.getPreco() * itemRequest.quant();

            ItemPedido item = new ItemPedido();
            item.setProduto(produto);
            item.setQuant(itemRequest.quant());
            item.setSubtotal(subtotal);
            item.setPedido(p);

            itens.add(item);

            total += subtotal;

            if (p.getStatus() == StatusPagamento.PAGO) {
                produto.setQuantidade(produto.getQuantidade() + itemRequest.quant());
            }
        }

        p.setItens(itens);
        p.setTotal(total);

        return pedidoMapper.toResponse(pedidoRepository.save(p));
    }

    @Transactional
    public PedidoResponse registrarPagamento(Long id) {
        Pedido p = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        if (p.getStatus() == StatusPagamento.PAGO) {
            throw new RuntimeException("O pedido já foi pago");
        }

        p.setStatus(StatusPagamento.PAGO);
        p.setDataPagamento(new Date());

        for (ItemPedido item : p.getItens()) {
            Produto produto = item.getProduto();
            produto.setQuantidade(produto.getQuantidade() + item.getQuant());
        }

        return pedidoMapper.toResponse(pedidoRepository.save(p));
    }

    @Transactional
    public void excluir(Long id) {
        Pedido p = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        if (p.getStatus() == StatusPagamento.PAGO) {
            throw new RuntimeException("Não é possível excluir um pedido que já foi pago");
        }

        pedidoRepository.delete(p);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarTodos() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        return pedidos.stream()
                .map(pedidoMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscarPorId(Long id) {
        Pedido p = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        return pedidoMapper.toResponse(p);
    }

    public Map<String, Object> calcularContasAPagar() {
        Double total = pedidoRepository.calcularContasAPagar();
        Long quantidade = pedidoRepository.countByStatus(StatusPagamento.PENDENTE);

        return Map.of(
                "total", total,
                "quantidade", quantidade
        );
    }

    public Double calcularSaidaPorPeriodo(String periodo) {
        LocalDateTime inicio;

        switch (periodo) {
            case "hoje" -> inicio = LocalDate.now().atStartOfDay();
            case "ultimos30dias" -> inicio = LocalDateTime.now().minusDays(30);
            case "mensal" -> inicio = LocalDate.now().withDayOfMonth(1).atStartOfDay();
            default -> inicio = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        }

        return pedidoRepository.calcularSaidaPorPeriodo(inicio);
    }

    public Long buscarTotalSemana() {
        LocalDate hoje = LocalDate.now();

        // Pega a segunda-feira da semana às 00:00:00
        LocalDateTime inicioDaSemana = hoje.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .atStartOfDay();

        // Pega o domingo da semana às 23:59:59.999999999
        LocalDateTime fimDaSemana = hoje.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))
                .atTime(LocalTime.MAX);

        return pedidoRepository.countByDataPedidoBetween(inicioDaSemana, fimDaSemana);
    }

    public List<PedidoResponse> buscarUltimosPedidos() {
        List<Pedido> pedidos = pedidoRepository.findTop5ByOrderByDataPedidoDesc();
        return pedidos.stream()
                .map(pedidoMapper::toResponse)
                .collect(Collectors.toList());
    }

}
