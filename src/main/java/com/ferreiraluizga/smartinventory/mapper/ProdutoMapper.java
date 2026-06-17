package com.ferreiraluizga.smartinventory.mapper;

import com.ferreiraluizga.smartinventory.dto.request.ProdutoRequest;
import com.ferreiraluizga.smartinventory.dto.response.ProdutoResponse;
import com.ferreiraluizga.smartinventory.entity.Categoria;
import com.ferreiraluizga.smartinventory.entity.Fornecedor;
import com.ferreiraluizga.smartinventory.entity.Marca;
import com.ferreiraluizga.smartinventory.entity.Produto;
import org.springframework.stereotype.Component;

@Component
public class ProdutoMapper {

    public ProdutoResponse toResponse(Produto p) {
        return new ProdutoResponse(
                p.getId(),
                p.getNome(),
                p.getDescricao(),
                p.getPreco(),
                p.getQuantidade(),
                p.getAtivo(),
                p.getFornecedor().getId(),
                p.getFornecedor().getNome(),
                p.getCategoria().getId(),
                p.getCategoria().getNome(),
                p.getMarca().getId(),
                p.getMarca().getNome()
        );
    }

    public Produto toEntity(ProdutoRequest dto) {
        Produto p = new Produto();
        p.setNome(dto.nome());
        p.setDescricao(dto.descricao());
        p.setPreco(dto.preco());
        p.setQuantidade(dto.quantidade());
        p.setAtivo(dto.ativo());

        Fornecedor f = new Fornecedor();
        f.setId(dto.fornecedorId());
        p.setFornecedor(f);

        Categoria c = new Categoria();
        c.setId(dto.categoriaId());
        p.setCategoria(c);

        Marca m = new Marca();
        m.setId(dto.marcaId());
        p.setMarca(m);

        return p;
    }

}
