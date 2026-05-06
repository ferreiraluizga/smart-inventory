package com.ferreiraluizga.smartinventory.repository;

import com.ferreiraluizga.smartinventory.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    // buscar produto por nome (contendo o texto)
    @Query(value = "select * from produtos where nome like CONCAT('%', :nome, '%')", nativeQuery = true)
    List<Produto> findByNome(@Param("nome") String nome);

    // listar produtos ativos
    @Query(value =  "select * from produtos where ativo = true", nativeQuery = true)
    List<Produto> findAllAtivos();

    // listar produtos com estoque baixo
    @Query(value = "select * from produtos where quantidade < :minimo", nativeQuery = true)
    List<Produto> findEstoqueBaixo(@Param("minimo") Integer minimo);
}
