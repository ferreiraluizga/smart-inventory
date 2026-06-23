import { useState } from "react";
import { categoriaService } from "../../services/categoriaService";
import Input from "../../components/form/Input";

function FormCadastrarCategoria({ onCadastrar, onErro }) {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");

    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);

        try {
            const novaCategoria = await categoriaService.salvar(nome, descricao);
            
            if (onCadastrar) {
                onCadastrar(novaCategoria);
            }

            setNome("");
            setDescricao("");
        } catch (error) {
            console.error("Erro ao cadastrar categoria:", error);
            
            if (onErro) {
                onErro("Não foi possível cadastrar a categoria. Tente novamente.")
            }
        } finally {
            setCarregando(false);
        }
    }

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
                placeholder="Digite o nome da categoria"
            />

            <Input
                label="Descrição"
                margin="mb-3"
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                disabled={carregando}
                placeholder="Digite a descrição da categoria"
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

export default FormCadastrarCategoria;
