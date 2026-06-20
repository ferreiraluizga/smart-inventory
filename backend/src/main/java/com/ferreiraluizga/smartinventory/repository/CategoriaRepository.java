package com.ferreiraluizga.smartinventory.repository;

import com.ferreiraluizga.smartinventory.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    // verificar existência de uma categoria para evitar nomes duplicados
    boolean existsByNome(String nome);

}
