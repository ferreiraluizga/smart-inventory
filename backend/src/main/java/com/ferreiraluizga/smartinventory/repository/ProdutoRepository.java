package com.ferreiraluizga.smartinventory.repository;

import com.ferreiraluizga.smartinventory.entity.Produto;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    @Override
    @EntityGraph(attributePaths = {"fornecedor", "categoria", "marca"})
    List<Produto> findAll();

    @Override
    @EntityGraph(attributePaths = {"fornecedor", "categoria", "marca"})
    Optional<Produto> findById(Long id);

    // buscar produto por nome (contendo o texto)
    @EntityGraph(attributePaths = {"fornecedor", "categoria", "marca"})
    List<Produto> findProdutoByNomeContainingIgnoreCaseOrderByNomeAsc(String nome);

    // listar produtos ativos
    @EntityGraph(attributePaths = {"fornecedor", "categoria", "marca"})
    List<Produto> findAllByAtivo(Boolean ativo);

    // listar produtos com estoque baixo
    @EntityGraph(attributePaths = {"fornecedor", "categoria", "marca"})
    List<Produto> findAllByQuantidadeLessThan(Integer minimo);

    @EntityGraph(attributePaths = {"fornecedor", "categoria", "marca"})
    List<Produto> findByMarca_Id(Long marcaId);

    Long countByMarca_Id(Long marcaId);

}
