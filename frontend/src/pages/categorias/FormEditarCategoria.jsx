import { useState } from "react";
import { categoriaService } from "../../services/categoriaService";
import Input from "../../components/form/Input";
import TextArea from "../../components/form/TextArea";
import ModalButton from "../../components/ui/ModalButton";

function FormEditarCategoria({ categoria, onSalvar, onErro }) {
    const [nome, setNome] = useState(categoria.nome);
    const [descricao, setDescricao] = useState(categoria.descricao || "");

    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);
        
        try {
            const categoriaAtualizada = await categoriaService.atualizar(categoria.id, nome, descricao);
            
            if (onSalvar) {
                onSalvar(categoriaAtualizada);
            }
        } catch (error) {
            console.error("Erro ao atualizar categoria:", error);
            
            if (onErro) {
                onErro("Não foi possível salvar as alterações da categoria.");
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
                placeholder="Digite o nome da categoria"
            />

            <TextArea 
                label="Descrição"
                margin="mb-3"
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Digite a descrição da categoria"
                value={descricao}
                rows="3"
                disabled={carregando}
                required
            />

            <div className="d-flex justify-content-end gap-2 mt-4">
                <ModalButton 
                    type="button"
                    color="light"
                    disabled={carregando}
                    buttonText="Cancelar"
                />
                
                <ModalButton 
                    type="submit"
                    color="primary"
                    disabled={carregando}
                    buttonText={carregando ? "Salvando..." : "Salvar alterações"}
                />
            </div>
        </form>
    );
}

export default FormEditarCategoria;
