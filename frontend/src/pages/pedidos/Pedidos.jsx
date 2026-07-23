import { useEffect, useState } from "react";
import { pedidoService } from "../../services/pedidoService"
import DashboardLayout from "../../components/layout/DashboardLayout";
import Header from "../../components/ui/Header";
import Toast from "../../components/ui/Toast";
import ModalConfirmacao from "../../components/ui/ModalConfirmacao";
import Spinner from "../../components/ui/Spinner";
import VisualizarItensPedidoHover from "./VisualizarItensPedidoHover.jsx";
import {Link, useLocation} from "react-router-dom";

function Pedidos() {
    const location = useLocation();

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
        const inicializarPagina = async () => {
            try {
                setLoading(true);

                // 1. Busca todos os pedidos do banco de dados
                const dados = await pedidoService.listarTodos();
                let listaAtualizada = dados || [];

                // 2. Se veio um pedido novo do CheckoutPedido, junta na lista e mostra o Toast
                if (location.state?.novoPedido) {
                    const novo = location.state.novoPedido;

                    // Evita duplicar na lista caso a API já tenha trazido o registro
                    if (!listaAtualizada.some(p => p.id === novo.id)) {
                        listaAtualizada = [novo, ...listaAtualizada];
                    }

                    mostrarToast("Pedido cadastrado com sucesso!", "success");

                    // Limpa o estado da rota para o Toast não repetir se o usuário der F5
                    window.history.replaceState({}, document.title);
                }

                // 3. Alimenta o estado uma única vez com a lista final montada
                setPedidos(listaAtualizada);

            } catch (error) {
                console.error("Erro ao inicializar a página de pedidos: ", error);
                mostrarToast("Erro ao carregar a lista de pedidos do servidor.");
            } finally {
                setLoading(false);
            }
        };

        inicializarPagina();
    }, [location]);

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

            // CORREÇÃO: Altera a propriedade 'status' para 'PAGO' para sincronizar com as badges da tabela
            setPedidos((pedidosAnteriores) =>
                pedidosAnteriores.map((p) =>
                    p.id === id
                        ? {
                            ...p,
                            status: "PAGO",
                            dataPagamento: new Date().toISOString() // Adiciona a data atual no formato ISO
                        }
                        : p
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
                buttonLink="/dashboard/pedidos/checkout" // Corrigido para ir direto para o PDV de CheckoutPedido
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
                                        <th>Data do Pedido</th>
                                        <th>Vencimento</th>
                                        <th>Pagamento</th>
                                        <th className="text-center" style={{ width: "130px" }}>Status</th>
                                        <th className="text-center">Qtd. Itens</th>
                                        <th className="text-end pe-4" style={{ width: "150px" }}>Ações</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {pedidosFiltrados.map((pedido) => (
                                        <tr key={pedido.id}>
                                            <td className="ps-4 fw-bold text-secondary">#{pedido.id}</td>
                                            <td>
                                                {pedido.fornecedorId ? (
                                                    <Link
                                                        to={`/dashboard/fornecedores/${pedido.fornecedorId}`}
                                                        className="fw-medium link-dark"
                                                    >
                                                        {pedido.fornecedorNome || "Sem fornecedor"}
                                                    </Link>
                                                ) : (
                                                    <span className="text-muted">Sem fornecedor</span>
                                                )}
                                            </td>
                                            <td>
                                                {pedido.dataPedido
                                                    ? new Date(pedido.dataPedido).toLocaleDateString('pt-BR')
                                                    : "Não informada"
                                                }
                                            </td>
                                            <td>
                                                {pedido.dataVencimento
                                                    ? new Date(pedido.dataVencimento).toLocaleDateString('pt-BR')
                                                    : "Não informada"
                                                }
                                            </td>
                                            <td>
                                                {pedido.status === "PAGO" && pedido.dataPagamento
                                                    ? new Date(pedido.dataPagamento).toLocaleDateString('pt-BR')
                                                    : <span className="text-muted">Não realizado</span>
                                                }
                                            </td>
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
                                                <VisualizarItensPedidoHover pedido={pedido} />
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