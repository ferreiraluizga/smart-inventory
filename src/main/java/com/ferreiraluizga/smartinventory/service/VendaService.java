package com.ferreiraluizga.smartinventory.service;

import com.ferreiraluizga.smartinventory.dto.request.ItemVendaRequest;
import com.ferreiraluizga.smartinventory.dto.request.VendaRequest;
import com.ferreiraluizga.smartinventory.dto.response.VendaResponse;
import com.ferreiraluizga.smartinventory.entity.ItemVenda;
import com.ferreiraluizga.smartinventory.entity.Produto;
import com.ferreiraluizga.smartinventory.entity.Venda;
import com.ferreiraluizga.smartinventory.mapper.VendaMapper;
import com.ferreiraluizga.smartinventory.repository.ItemVendaRepository;
import com.ferreiraluizga.smartinventory.repository.ProdutoRepository;
import com.ferreiraluizga.smartinventory.repository.VendaRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
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

}
