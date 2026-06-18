package com.ferreiraluizga.smartinventory.repository;

import com.ferreiraluizga.smartinventory.entity.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {

    // verificando se existe fornecedor com o mesmo cnpj ou email
    boolean existsByCnpj(String cnpj);
    boolean existsByEmail(String email);

    // buscar fornecedor por nome (contendo o texto)
    @Query(value = "select * from fornecedores where nome like CONCAT('%', :nome, '%')", nativeQuery = true)
    List<Fornecedor> findByNome(@Param("nome") String nome);

}
