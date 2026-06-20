package com.ferreiraluizga.smartinventory.repository;

import com.ferreiraluizga.smartinventory.entity.ItemVenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemVendaRepository extends JpaRepository<ItemVenda, Long> {
}
