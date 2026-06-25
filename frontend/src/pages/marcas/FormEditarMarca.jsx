import { useState } from "react";
import { marcaService } from "../../services/marcaService";
import Input from "../../components/form/Input";
import ModalButton from "../../components/ui/ModalButton";

function FormEditarMarca({ marca, onSalvar, onErro }) {
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
            
            if (onErro) {
                const mensagemServidor = 
                    error.response?.data?.message || // Padrão se você usa Axios
                    error.message ||                 // Padrão do erro genérico
                    "Não foi possível salvar as alterações. Tente novamente.";
                
                onErro(mensagemServidor);
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
                <ModalButton 
                    type="button"
                    color="light"
                    disabled={carregando}
                    buttonText="Cancelar"
                    fecharModal
                />
                
                <ModalButton 
                    type="submit"
                    color="warning"
                    disabled={carregando}
                    buttonText={carregando ? "Cadastrando..." : "Cadastrar"}
                />
            </div>
        </form>
    );
}

export default FormEditarMarca;