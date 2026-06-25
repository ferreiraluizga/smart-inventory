import { useState } from "react";
import { fornecedorService } from "../../services/fornecedorService";
import Input from "../../components/form/Input";
import ModalButton from "../../components/ui/ModalButton";

function FormCadastrarFornecedor({ onCadastrar, onErro }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cnpj, setCnpj] = useState("");

    const [carregando, setCarregando] = useState(false);

    const formatarCNPJ = (valor) => {
        const apenasNumeros = valor.replace(/\D/g, "");

        return apenasNumeros
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2")
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);

        try {
            const novoFornecedor = await fornecedorService.salvar(nome, cnpj, email);

            if (onCadastrar) {
                onCadastrar(novoFornecedor);
            }

            setNome("");
            setEmail("");
            setCnpj("");
        } catch (error) {
            console.error("Erro ao cadastrar fornecedor:", error);

            if (onErro) {
                const mensagemServidor = 
                    error.response?.data?.message || 
                    error.message ||                 
                    "Não foi possível cadastrar o fornecedor. Tente novamente.";
                
                onErro(mensagemServidor);
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
                    buttonText={carregando ? "Cadastrando..." : "Cadastrar"}
                />
            </div>
        </form>
    );
}

export default FormCadastrarFornecedor;