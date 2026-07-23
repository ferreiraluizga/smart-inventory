package com.ferreiraluizga.smartinventory.repository;

import com.ferreiraluizga.smartinventory.entity.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {

    @Query(value = "SELECT COALESCE(SUM(v.total), 0.0) FROM vendas v WHERE v.data_venda >= :inicio", nativeQuery = true)
    Double calcularFaturamentoPorPeriodo(@Param("inicio") LocalDateTime inicio);

    Long countByDataVendaBetween(LocalDateTime dataVendaAfter, LocalDateTime dataVendaBefore);

}
