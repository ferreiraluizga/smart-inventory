import { useState } from "react";
import { marcaService } from "../../services/marcaService";

function FormCadastrarMarca({ onCadastrar }) {
    const [nome, setNome] = useState("");
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);
        try {
            const novaMarca = await marcaService.salvar(nome);
            
            if (onCadastrar) {
                onCadastrar(novaMarca);
            }

            setNome("");
        } catch (error) {
            console.error("Erro ao cadastrar marca:", error);
            alert("Não foi possível cadastrar a marca.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="nomeNovaMarca" className="form-label fw-semibold text-secondary">
                    Nome da Nova Marca
                </label>
                <input
                    type="text"
                    className="form-control form-control-lg rounded-3 fs-6"
                    id="nomeNovaMarca"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Nike, Apple, Samsung..."
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
                    {carregando ? "Cadastrando..." : "Cadastrar"}
                </button>
            </div>
        </form>
    );
}

export default FormCadastrarMarca;