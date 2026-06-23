import { useState } from "react";
import { marcaService } from "../../services/marcaService";
import Input from "../../components/form/Input";

function FormCadastrarMarca({ onCadastrar, onErro }) {
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
            
            if (onErro) {
                onErro("Não foi possível cadastrar a marca. Tente novamente.");
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Nome"
                margin="mb-3"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                disabled={carregando}
                placeholder="Digite o nome da marca"
            />

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