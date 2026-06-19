package com.ferreiraluizga.smartinventory.mapper;

import com.ferreiraluizga.smartinventory.dto.response.ItemVendaResponse;
import com.ferreiraluizga.smartinventory.dto.response.VendaResponse;
import com.ferreiraluizga.smartinventory.entity.ItemVenda;
import com.ferreiraluizga.smartinventory.entity.Venda;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class VendaMapper {

    public VendaResponse toResponse(Venda venda) {
        return new VendaResponse(
            venda.getId(),
            venda.getDataVenda(),
            venda.getTotal(),
            venda.getFormaPagamento(),
            venda.getItens().stream()
                .map(this::toItemVendaResponse)
                .collect(Collectors.toList())
        );
    }

    public ItemVendaResponse toItemVendaResponse(ItemVenda item) {
        return new ItemVendaResponse(
            item.getProduto().getId(),
            item.getProduto().getNome(),
            item.getQuant(),
            item.getSubtotal()
        );
    }

}
