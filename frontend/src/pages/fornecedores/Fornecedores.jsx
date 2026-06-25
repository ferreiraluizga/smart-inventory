import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Header from "../../components/ui/Header";
import { fornecedorService } from "../../services/fornecedorService";
import Toast from "../../components/ui/Toast";

function Fornecedores() {
    const [fornecedores, setFornecedores] = useState([]);
    const [busca, setBusca] = useState("");

    const [toast, setToast] = useState({ visivel: false, mensagem: "", tipo: "danger" });

    const [loading, setLoading] = useState(true);

    const mostrarToast = (mensagem, tipo = "danger") => {
        setToast({ visivel: true, mensagem, tipo });
        setTimeout(() => {
            setToast({ visivel: false, mensagem: "", tipo: "danger" });
        }, 4000);
    };

    useEffect(() => {
        carregarFornecedores();
    }, []);

    const carregarFornecedores = async () => {
        try {
            setLoading(true)
            const dados = await fornecedorService.listarTodos();
            setFornecedores(dados || []);
        } catch (error) {
            console.error("Erro ao listar marcas:", error);
            mostrarToast("Erro ao carregar a lista de marcas do servidor.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <DashboardLayout>
            <Header 
                titulo="Fornecedores"
                descricao="Gerencie os fornecedores do estoque."
                searchPlaceholder="Buscar fornecedor..."
                searchValue={busca}
                searchOnChange={(e) => setBusca(e.target.value)}
                buttonTarget="#modalFornecedor"
                buttonText="Cadastrar Fornecedor"
            />

            <Toast
                visivel={toast.visivel}
                mensagem={toast.mensagem}
                tipo={toast.tipo}
                onClose={() => setToast({ ...toast, visivel: false })}
            />
        </DashboardLayout>
    );
}

export default Fornecedores;