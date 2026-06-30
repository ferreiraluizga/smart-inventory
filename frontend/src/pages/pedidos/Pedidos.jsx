import { useEffect, useState } from "react";
import { pedidoService } from "../../services/pedidoService"
import DashboardLayout from "../../components/layout/DashboardLayout";
import Header from "../../components/ui/Header";
import Toast from "../../components/ui/Toast";
import ModalConfirmacao from "../../components/ui/ModalConfirmacao";
import Spinner from "../../components/ui/Spinner";
import VisualizarItensHover from "./VisualizarItensHover";

function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
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
        carregarPedidos();
    }, []);

    const carregarPedidos = async () => {
        try {
            setLoading(true)
            const dados = await pedidoService.listarTodos();
            setPedidos(dados || []);
        } catch (error) {
            console.error("Erro ao listar os pedidos: ", error);
            mostrarToast("Erro ao carregar a lista de pedidos do servidor.");
        } finally {
            setLoading(false);
        }
    }

    const pedidosFiltrados = pedidos
        .filter(p =>
            p.fornecedorNome?.toLowerCase().includes(busca.toLowerCase()) ||
            String(p.id).includes(busca)
        )
        .sort((a, b) => b.id - a.id);

    const handleMarcarComoPago = async (id) => {
        try {
            await pedidoService.registrarPagamento(id);

            setPedidos((pedidosAnteriores) =>
                pedidosAnteriores.map((p) =>
                    p.id === id ? { ...p, pago: true } : p
                )
            );
            mostrarToast("Pagamento registrado com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao registrar pagamento do pedido:", error);
            mostrarToast("Não foi possível registrar o pagamento.");
        }
    }

    const handlePedidoExcluido = async (id) => {
        try {
            await pedidoService.excluir(id);
            setPedidos((pedidosAnteriores) => pedidosAnteriores.filter((p) => p.id !== id));
            mostrarToast("Pedido excluído com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao excluir pedido:", error);
            mostrarToast("Não foi possível excluir o pedido.");
        }
    }

    return (
        <DashboardLayout>
            <Header
                titulo="Pedidos"
                descricao="Gerencie os pedidos realizados."
                searchPlaceholder="Buscar por fornecedor ou ID..."
                searchValue={busca}
                searchOnChange={(e) => setBusca(e.target.value)}
                buttonLink="/dashboard/pedidos/checkout" // Corrigido para ir direto para o PDV de Checkout
                buttonText="Realizar Pedido"
            />

            {loading ? (
                <Spinner />
            ) : (
                <>
                    {pedidosFiltrados.length === 0 ? (
                        <div className="text-center text-muted mt-5 py-5">
                            <i className="bi bi-receipt fs-1"></i>
                            <p className="mt-2">Nenhum pedido encontrado.</p>
                        </div>
                    ) : (
                        <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
                            <div className="table-responsive">
                                <table className="table align-middle table-hover m-0">
                                    <thead className="table-light text-secondary">
                                        <tr>
                                            <th className="ps-4" style={{ width: "80px" }}>ID</th>
                                            <th>Fornecedor</th>
                                            <th>Vencimento</th>
                                            {/* INCLUSÃO 1: Coluna de status no cabeçalho */}
                                            <th className="text-center" style={{ width: "130px" }}>Status</th>
                                            <th className="text-center">Qtd. Itens</th>
                                            {/* AJUSTE: Aumentado o estilo de largura para acomodar o novo botão */}
                                            <th className="text-end pe-4" style={{ width: "160px" }}>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidosFiltrados.map((pedido) => (
                                            <tr key={pedido.id}>
                                                <td className="ps-4 fw-bold text-secondary">#{pedido.id}</td>
                                                <td>
                                                    <span className="fw-semibold text-dark">
                                                        {pedido.fornecedorNome || "Fornecedor não identificado"}
                                                    </span>
                                                </td>
                                                <td>
                                                    {pedido.dataVencimento
                                                        ? new Date(pedido.dataVencimento).toLocaleDateString('pt-BR')
                                                        : "Não informada"
                                                    }
                                                </td>
                                                {/* INCLUSÃO 2: Badges coloridos indicando a situação do pagamento */}
                                                <td className="text-center">
                                                    {pedido.status === "PAGO" ? (
                                                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-2">
                                                            <i className="bi bi-check-circle-fill me-1"></i> Pago
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2.5 py-1.5 rounded-2">
                                                            <i className="bi bi-clock-history me-1"></i> Pendente
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <VisualizarItensHover pedido={pedido} />
                                                </td>
                                                <td className="text-end pe-4">
                                                    {pedido.status !== "PAGO" && (
                                                        <>
                                                            <button
                                                                className="btn btn-outline-success btn-sm border-0 me-1"
                                                                title="Marcar como Pago"
                                                                data-bs-toggle="modal"
                                                                data-bs-target={`#modalPagarPedido-${pedido.id}`}
                                                            >
                                                                <i className="bi bi-cash-coin fs-5"></i>
                                                            </button>

                                                            <ModalConfirmacao
                                                                id={`modalPagarPedido-${pedido.id}`}
                                                                titulo="Confirmar Pagamento?"
                                                                descricao={
                                                                    <span>
                                                                        Você está confirmando o pagamento do pedido <strong className="text-dark">#{pedido.id}</strong> do fornecedor <strong className="text-dark">{pedido.fornecedorNome}</strong>.
                                                                    </span>
                                                                }
                                                                onConfirmar={() => handleMarcarComoPago(pedido.id)}
                                                                tipo="success"
                                                            />
                                                        </>
                                                    )}

                                                    <button
                                                        className="btn btn-outline-danger btn-sm border-0"
                                                        data-bs-toggle="modal"
                                                        data-bs-target={`#modalExcluirPedido-${pedido.id}`}
                                                    >
                                                        <i className="bi bi-trash3 fs-5"></i>
                                                    </button>

                                                    <ModalConfirmacao
                                                        id={`modalExcluirPedido-${pedido.id}`}
                                                        titulo="Você tem certeza?"
                                                        descricao={
                                                            <span>
                                                                Você excluirá permanentemente o pedido <strong className="text-dark">#{pedido.id}</strong> do fornecedor <strong className="text-dark">{pedido.fornecedorNome}</strong>. Esta ação não poderá ser desfeita.
                                                            </span>
                                                        }
                                                        onConfirmar={() => handlePedidoExcluido(pedido.id)}
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

export default Pedidos;