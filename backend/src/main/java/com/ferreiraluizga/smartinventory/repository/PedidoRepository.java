package com.ferreiraluizga.smartinventory.repository;

import com.ferreiraluizga.smartinventory.entity.Pedido;
import com.ferreiraluizga.smartinventory.entity.enums.StatusPagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Query(value = "SELECT COALESCE(SUM(p.total), 0.0) FROM pedidos p WHERE p.status = 'PENDENTE'", nativeQuery = true)
    Double calcularContasAPagar();

    Long countByStatus(StatusPagamento statusPagamento);

    @Query(value = "SELECT COALESCE(SUM(p.total), 0.0) FROM pedidos p WHERE p.data_pedido >= :inicio AND p.status = 'PAGO'", nativeQuery = true)
    Double calcularSaidaPorPeriodo(@Param("inicio") LocalDateTime inicio);

    Long countByDataPedidoBetween(LocalDateTime dataPedidoAfter, LocalDateTime dataPedidoBefore);

}
