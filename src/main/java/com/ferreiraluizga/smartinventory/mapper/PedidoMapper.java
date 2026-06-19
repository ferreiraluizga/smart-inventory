package com.ferreiraluizga.smartinventory.mapper;

import com.ferreiraluizga.smartinventory.dto.response.ItemPedidoResponse;
import com.ferreiraluizga.smartinventory.dto.response.PedidoResponse;
import com.ferreiraluizga.smartinventory.entity.ItemPedido;
import com.ferreiraluizga.smartinventory.entity.Pedido;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class PedidoMapper {

    public PedidoResponse toResponse(Pedido pedido) {
        return new PedidoResponse(
                pedido.getId(),
                pedido.getFornecedor().getId(),
                pedido.getFornecedor().getNome(),
                pedido.getTotal(),
                pedido.getDataPedido(),
                pedido.getDataVencimento(),
                pedido.getDataPagamento(),
                pedido.getStatus(),
                pedido.getItens().stream()
                        .map(this::toItemPedidoResponse)
                        .collect(Collectors.toList())
        );
    }

    public ItemPedidoResponse toItemPedidoResponse(ItemPedido item) {
        return new ItemPedidoResponse(
                item.getProduto().getId(),
                item.getProduto().getNome(),
                item.getQuant(),
                item.getSubtotal()
        );
    }

}
