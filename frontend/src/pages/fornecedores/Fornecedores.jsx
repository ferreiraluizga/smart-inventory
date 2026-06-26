import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Header from "../../components/ui/Header";
import { fornecedorService } from "../../services/fornecedorService";
import Toast from "../../components/ui/Toast";
import Modal from "../../components/ui/Modal";
import FormCadastrarFornecedor from "./FormCadastrarFornecedor";
import FormEditarFornecedor from "./FormEditarFornecedor";
import Card from "../../components/ui/Card";
import ModalConfirmacao from "../../components/ui/ModalConfirmacao";
import Spinner from "../../components/ui/Spinner";

function Fornecedores() {
    const formatarCNPJExibicao = (valor) => {
        if (!valor) return "";
        const apenasNumeros = valor.replace(/\D/g, "");

        return apenasNumeros
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2")
            .substring(0, 18);
    };

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

    const fornecedoresFiltrados = fornecedores.filter(f =>
        f.nome.toLowerCase().includes(busca.toLowerCase())
    );

    const handleFornecedorCriado = (novoFornecedor) => {
        setFornecedores((fornecedoresAnteriores) => [...fornecedoresAnteriores, novoFornecedor]);
        mostrarToast("Fornecedor cadastrado com sucesso!", "success");

        const modalElement = document.getElementById("modalFornecedor");
        if (modalElement) {
            const btnFechar = modalElement.querySelector('[data-bs-dismiss="modal"]');
            if (btnFechar) {
                btnFechar.click();
            }
        }
    }

    const handleFornecedorAtualizado = (fornecedorEditado) => {
        setFornecedores((fornecedoresAnteriores) =>
            fornecedoresAnteriores.map((f) => (f.id === fornecedorEditado.id ? fornecedorEditado : f))
        );
        mostrarToast("Fornecedor atualizado com sucesso!", "success");

        const modalElement = document.getElementById(`modalEditarFornecedor-${fornecedorEditado.id}`);
        if (modalElement) {
            const btnFechar = modalElement.querySelector('[data-bs-dismiss="modal"]');
            if (btnFechar) btnFechar.click();
        }
    };

    const handleFornecedorExcluido = async (id) => {
        try {
            await fornecedorService.excluir(id);
            setFornecedores((fornecedoresAnteriores) => fornecedoresAnteriores.filter((f) => f.id !== id));
            mostrarToast("Fornecedor excluído com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao excluir fornecedor:", error);
            mostrarToast("Não foi possível excluir o fornecedor. Vinculada a produtos?");
        }
    };

    const handleFornecedorErro = (mensagemErro) => {
        mostrarToast(mensagemErro, "danger");
    };

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

            <Modal
                id="modalFornecedor"
                title="Cadastrar fornecedor"
            >
                <FormCadastrarFornecedor onCadastrar={handleFornecedorCriado} onErro={handleFornecedorErro} />
            </Modal>

            {loading ? (
                <Spinner />
            ) : (
                <>
                    {fornecedoresFiltrados.length === 0 ? (
                        <div className="text-center text-muted mt-5 py-5">
                            <i className="bi bi-person-lines-fill fs-1"></i>
                            <p className="mt-2">Nenhum fornecedor encontrado com esse nome.</p>
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
                            {fornecedoresFiltrados.map((fornecedor) => (
                                <div className="col" key={fornecedor.id}>
                                    <Card
                                        icon="person-lines-fill"
                                        title={fornecedor.nome}
                                        buttonEditarTarget={`#modalEditarFornecedor-${fornecedor.id}`}
                                        buttonExcluirTarget={`#modalExcluirFornecedor-${fornecedor.id}`}
                                    >
                                        <p className="mb-1 text-muted">
                                            <strong>CNPJ:</strong> {formatarCNPJExibicao(fornecedor.cnpj)}
                                        </p>
                                        <p className="mb-0 text-muted">
                                            <strong>E-mail:</strong> {fornecedor.email}
                                        </p>
                                    </Card>

                                    <Modal id={`modalEditarFornecedor-${fornecedor.id}`} title="Editar fornecedor">
                                        <FormEditarFornecedor
                                            fornecedor={fornecedor}
                                            onSalvar={handleFornecedorAtualizado}
                                            onErro={handleFornecedorErro}
                                        />
                                    </Modal>

                                    <ModalConfirmacao
                                        id={`modalExcluirFornecedor-${fornecedor.id}`}
                                        titulo="Você tem certeza"
                                        descricao={
                                            <span>
                                                Você excluirá o fornecedor <strong className="text-dark">{fornecedor.nome}</strong> e todos os dados associados a ele. Essa ação é irreversível.
                                            </span>
                                        }
                                        onConfirmar={() => handleFornecedorExcluido(fornecedor.id)}
                                        tipo="danger"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

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