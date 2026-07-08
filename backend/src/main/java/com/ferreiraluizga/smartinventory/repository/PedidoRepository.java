package com.ferreiraluizga.smartinventory.repository;

import com.ferreiraluizga.smartinventory.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Query(value = "SELECT COALESCE(SUM(p.total), 0.0) FROM pedidos p WHERE p.data_pedido >= :inicio AND p.status = 'PENDENTE'", nativeQuery = true)
    Double calcularContasAPagarPorPeriodo(@Param("inicio") LocalDateTime inicio);

    @Query(value = "SELECT COALESCE(SUM(p.total), 0.0) FROM pedidos p WHERE p.data_pedido >= :inicio", nativeQuery = true)
    Double calcularSaidaPorPeriodo(@Param("inicio") LocalDateTime inicio);

}
