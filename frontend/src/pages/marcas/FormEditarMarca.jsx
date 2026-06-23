import { useState } from "react";
import { marcaService } from "../../services/marcaService";

function FormEditarMarca({ marca, onSalvar }) {
    const [nome, setNome] = useState(marca.nome);
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);
        try {
            const marcaAtualizada = await marcaService.atualizar(marca.id, nome);
            
            if (onSalvar) {
                onSalvar(marcaAtualizada);
            }
        } catch (error) {
            console.error("Erro ao atualizar marca:", error);
            alert("Não foi possível salvar as alterações.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor={`nomeMarca-${marca.id}`} className="form-label fw-semibold text-secondary">
                    Nome da Marca
                </label>
                <input
                    type="text"
                    className="form-control form-control-lg rounded-3 fs-6"
                    id={`nomeMarca-${marca.id}`}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Nike, Apple..."
                    required
                    disabled={carregando}
                />
            </div>

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
                    data-bs-dismiss="modal"
                    disabled={carregando}
                >
                    {carregando ? "Salvando..." : "Salvar Alterações"}
                </button>
            </div>
        </form>
    );
}

export default FormEditarMarca;