import { useState } from "react";
import { categoriaService } from "../../services/categoriaService";

function FormEditarCategoria({ categoria, onSalvar, onErro }) {
    const [nome, setNome] = useState(categoria.nome);
    const [descricao, setDescricao] = useState(categoria.descricao || "");
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);
        
        try {
            // Chama o serviço passando a ID, o novo nome e a nova descrição
            const categoriaAtualizada = await categoriaService.atualizar(categoria.id, nome, descricao);
            
            if (onSalvar) {
                onSalvar(categoriaAtualizada);
            }
        } catch (error) {
            console.error("Erro ao atualizar categoria:", error);
            
            // Dispara o erro para o Toast da tela principal (Categorias.jsx)
            if (onErro) {
                onErro("Não foi possível salvar as alterações da categoria.");
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* CAMPO NOME */}
            <div className="mb-3">
                <label htmlFor={`nomeCat-${categoria.id}`} className="form-label fw-semibold text-secondary">
                    Nome da Categoria
                </label>
                <input
                    type="text"
                    className="form-control form-control-lg rounded-3 fs-6"
                    id={`nomeCat-${categoria.id}`}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Alimentos, Eletrônicos..."
                    required
                    disabled={carregando}
                />
            </div>

            {/* CAMPO DESCRIÇÃO */}
            <div className="mb-3">
                <label htmlFor={`descCat-${categoria.id}`} className="form-label fw-semibold text-secondary">
                    Descrição
                </label>
                <textarea
                    className="form-control form-control-lg rounded-3 fs-6"
                    id={`descCat-${categoria.id}`}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Digite uma breve descrição sobre a categoria..."
                    required
                    disabled={carregando}
                    rows="3"
                />
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                    type="button"
                    className="btn btn-light rounded-3 px-4"
                    data-bs-dismiss="modal"
                    disabled={carregando}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="btn btn-primary rounded-3 px-4"
                    data-bs-dismiss="modal" // Fecha se der sucesso. Se der erro, o Toast avisa na tela pai
                    disabled={carregando}
                >
                    {carregando ? "Salvando..." : "Salvar Alterações"}
                </button>
            </div>
        </form>
    );
}

export default FormEditarCategoria;
