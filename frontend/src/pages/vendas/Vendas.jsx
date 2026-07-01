import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import Header from "../../components/ui/Header.jsx";
import {useEffect, useState} from "react";
import {vendaService} from "../../services/vendaService.js";
import {useLocation} from "react-router-dom";
import ModalConfirmacao from "../../components/ui/ModalConfirmacao.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import Toast from "../../components/ui/Toast.jsx";
import VisualizarItensPedidoHover from "../pedidos/VisualizarItensPedidoHover.jsx";
import VisualizarItensVendaHover from "./VisualizarItensVendaHover.jsx";

function Vendas() {
    const location = useLocation();

    const [vendas, setVendas] = useState([]);

    const [toast, setToast] = useState({ visivel: false, mensagem: "", tipo: "danger" });

    const [loading, setLoading] = useState(true);

    const mostrarToast = (mensagem, tipo = "danger") => {
        setToast({ visivel: true, mensagem, tipo });
        setTimeout(() => {
            setToast({ visivel: false, mensagem: "", tipo: "danger" });
        }, 4000);
    };

    useEffect(() => {
        const inicializarPagina = async () => {
            try {
                setLoading(true);

                const dados = await vendaService.listarTodos();
                let listaAtualizada = dados || [];

                if (location.state?.novaVenda) {
                    const novo = location.state.novaVenda;

                    if (!listaAtualizada.some(p => p.id === novo.id)) {
                        listaAtualizada = [novo, ...listaAtualizada];
                    }

                    mostrarToast("Venda cadastrada com sucesso!", "success");

                    window.history.replaceState({}, document.title);
                }

                setVendas(listaAtualizada);
            } catch (error) {
                console.error("Erro ao inicializar a página de vendas: ", error);
                mostrarToast("Erro ao carregar a lista de vendas do servidor.");
            } finally {
                setLoading(false);
            }
        };

        inicializarPagina();
    }, [location]);

    const carregarVendas = async () => {
        try {
            setLoading(true)
            const dados = await vendaService.listarTodos();
            setVendas(dados || []);
        } catch (error) {
            console.error("Erro ao listar as vendas: ", error);
            mostrarToast("Erro ao carregar a lista de vendas do servidor.");
        } finally {
            setLoading(false);
        }
    }

    const vendasOrdenadas = [...vendas].sort((a, b) => b.id - a.id);

    const handleVendaExcluida = async (id) => {
        try {
            await vendaService.excluir(id);
            setVendas((vendasAnteriores) => vendasAnteriores.filter((p) => p.id !== id));
            mostrarToast("Venda excluída com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao excluir venda:", error);
            mostrarToast("Não foi possível excluir a venda.");
        }
    }

    return (
        <DashboardLayout>
            <Header
                titulo="Vendas"
                descricao="Gerencie as vendas realizados."
                buttonLink="/dashboard/vendas/checkout"
                buttonText="Realizar Venda"
                mostrarPesquisa={false}
            />

            {loading ? (
                <Spinner />
            ) : (
                <>
                    {vendasOrdenadas.length === 0 ? (
                        <div className="text-center text-muted mt-5 py-5">
                            {/* Ícone bi-cash-coin representando vendas conforme alinhamos anteriormente */}
                            <i className="bi bi-cash-coin fs-1"></i>
                            <p className="mt-2">Nenhuma venda realizada até o momento.</p>
                        </div>
                    ) : (
                        <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
                            <div className="table-responsive">
                                <table className="table align-middle table-hover m-0">
                                    <thead className="table-light text-secondary">
                                    <tr>
                                        <th className="ps-4" style={{ width: "80px" }}>ID</th>
                                        <th>Data / Hora</th>
                                        <th className="text-center" style={{ width: "160px" }}>Forma de Pagamento</th>
                                        <th className="text-center">Qtd. Itens</th>
                                        <th className="text-end">Valor Total</th>
                                        <th className="text-end pe-4" style={{ width: "120px" }}>Ações</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {vendasOrdenadas.map((venda) => (
                                        <tr key={venda.id}>
                                            <td className="ps-4 fw-bold text-secondary">#{venda.id}</td>
                                            <td>
                                                {venda.dataVenda
                                                    ? new Date(venda.dataVenda).toLocaleString('pt-BR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                    : "Não informada"
                                                }
                                            </td>
                                            {/* Mapeamento visual das constantes do seu Enum FormaPagamento */}
                                            <td className="text-center">
                                                {venda.formaPagamento === "CARTAO" && (
                                                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1.5 rounded-2">
                                                        <i className="bi bi-credit-card me-1"></i> Cartão
                                                    </span>
                                                )}
                                                {venda.formaPagamento === "PIX" && (
                                                    <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle px-2.5 py-1.5 rounded-2">
                                                        <i className="bi bi-qr-code me-1"></i> PIX
                                                    </span>
                                                )}
                                                {venda.formaPagamento === "DINHEIRO" && (
                                                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-2">
                                                        <i className="bi bi-cash me-1"></i> Dinheiro
                                                    </span>
                                                )}
                                                {!venda.formaPagamento && <span className="text-muted"></span>}
                                            </td>
                                            <td className="text-center">
                                                <VisualizarItensVendaHover venda={venda} />
                                            </td>
                                            <td className="text-end fw-bold text-dark">
                                                {new Intl.NumberFormat('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                }).format(venda.total || 0)}
                                            </td>
                                            <td className="text-end pe-4">
                                                {/* Botão de Excluir / Estornar Venda */}
                                                <button
                                                    className="btn btn-outline-danger btn-sm border-0"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={`#modalExcluirVenda-${venda.id}`}
                                                    title="Excluir Venda"
                                                >
                                                    <i className="bi bi-trash3 fs-5"></i>
                                                </button>

                                                <ModalConfirmacao
                                                    id={`modalExcluirVenda-${venda.id}`}
                                                    titulo="Estornar/Excluir Venda?"
                                                    descricao={
                                                        <span>
                                        Você excluirá permanentemente o registro da venda <strong className="text-dark">#{venda.id}</strong> no valor de <strong className="text-dark">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(venda.total || 0)}</strong>. Esta ação não poderá ser desfeita.
                                    </span>
                                                    }
                                                    onConfirmar={() => handleVendaExcluida(venda.id)}
                                                    tipo="danger"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
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

export default Vendas;