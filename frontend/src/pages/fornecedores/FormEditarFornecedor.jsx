import { useState } from "react";
import Input from "../../components/form/Input";
import ModalButton from "../../components/ui/ModalButton";
import { fornecedorService } from "../../services/fornecedorService";

function FormEditarFornecedor({ fornecedor, onSalvar, onErro }) {
    const formatarCNPJ = (valor) => {
        if (!valor) return "";
        const apenasNumeros = valor.replace(/\D/g, "");
        return apenasNumeros
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2")
            .replace(/(-\d{2})\d+?$/, "$1");
    };

    const [nome, setNome] = useState(fornecedor.nome);
    const [cnpj, setCnpj] = useState(formatarCNPJ(fornecedor.cnpj));
    const [email, setEmail] = useState(fornecedor.email);

    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);
        try {
            const cnpjLimpo = cnpj.replace(/\D/g, "");

            const fornecedorAtualizado = await fornecedorService.atualizar(fornecedor.id, nome, cnpjLimpo, email);
            
            if (onSalvar) {
                onSalvar(fornecedorAtualizado);
            }
        } catch (error) {
            console.error("Erro ao atualizar fornecedor:", error);
            
            if (onErro) {
                const mensagemServidor = 
                    error.response?.data?.message || 
                    error.message ||                 
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
                placeholder="Digite o nome do fornecedor"
                type="text"
                required
                disabled={carregando}
                onChange={(e) => setNome(e.target.value)}
                value={nome}
            />

            <Input
                label="CNPJ"
                margin="mb-3"
                placeholder="Digite o cnpj do fornecedor"
                type="text"
                minLength={18}
                maxLength={18}
                required
                disabled={carregando}
                onChange={(e) => setCnpj(formatarCNPJ(e.target.value))}
                value={cnpj}
            />

            <Input
                label="E-mail"
                margin="mb-3"
                placeholder="Digite o email do fornecedor"
                type="email"
                required
                disabled={carregando}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
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
                    buttonText={carregando ? "Atualizando..." : "Atualizar"}
                />
            </div>
        </form>
    );
}

export default FormEditarFornecedor;