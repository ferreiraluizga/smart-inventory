import DashboardLayout from "../components/layout/DashboardLayout";
import {useEffect, useState} from "react";
import {vendaService} from "../services/vendaService.js";
import Spinner from "../components/ui/Spinner.jsx";
import Toast from "../components/ui/Toast.jsx";
import {pedidoService} from "../services/pedidoService.js";
import {produtoService} from "../services/produtoService.js";
import {Link} from "react-router-dom";
import {categoriaService} from "../services/categoriaService.js";
import {fornecedorService} from "../services/fornecedorService.js";
import {marcaService} from "../services/marcaService.js";

function Dashboard() {
    const [periodo, setPeriodo] = useState("mensal");
    const [faturamento, setFaturamento] = useState(0);
    const [saida, setSaida] = useState(0);
    const [contas, setContas] = useState(0);
    const [pedidosPendentes, setPedidosPendentes] = useState(0);
    const [totalEstoque, setTotalEstoque] = useState(0);
    const [totalCategoria, setTotalCategoria] = useState(0);
    const [totalFornecedor, setTotalFornecedor] = useState(0);
    const [totalMarca, setTotalMarca] = useState(0);
    const [totalPedido, setTotalPedido] = useState(0);
    const [totalVenda, setTotalVenda] = useState(0);
    const [ultimosPedidos, setUltimosPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ visivel: false, mensagem: "", tipo: "danger" });

    useEffect(() => {
        carregarDadosPainel();
    }, [periodo]);

    const carregarDadosPainel = async () => {
        try {
            setLoading(true);

            const [dadosFaturamento, dadosSaida, dadosContas, dadosEstoque, dadosCategoria, dadosFornecedor, dadosMarca, dadosPedido, dadosVenda, dadosUltimosPedidos] = await Promise.all([
                vendaService.calcularFaturamentoPorPeriodo(periodo),
                pedidoService.calcularSaidaPorPeriodo(periodo),
                pedidoService.calcularContasAPagar(),
                produtoService.buscarTotalEstoque(),
                categoriaService.buscarTotal(),
                fornecedorService.buscarTotal(),
                marcaService.buscarTotal(),
                pedidoService.buscarTotal(),
                vendaService.buscarTotal(),
                pedidoService.buscarUltimosPedidos()
            ]);

            setFaturamento(dadosFaturamento.faturamento || 0);
            setSaida(dadosSaida.saida || 0);
            setContas(dadosContas.total)
            setPedidosPendentes(dadosContas.quantidade)
            setTotalEstoque(dadosEstoque.total);
            setTotalCategoria(dadosCategoria.total);
            setTotalFornecedor(dadosFornecedor.total);
            setTotalMarca(dadosMarca.total);
            setTotalPedido(dadosPedido.total);
            setTotalVenda(dadosVenda.total);
            setUltimosPedidos(dadosUltimosPedidos);
        } catch (error) {
            console.error("Erro ao carregar dados do painel:", error);
            setToast({ visivel: true, mensagem: "Erro ao atualizar dados do servidor.", tipo: "danger" });
        } finally {
            setLoading(false);
        }
    };

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(valor);
    };

    const obterDescricaoPeriodo = () => {
        switch (periodo) {
            case "hoje":
                return "Hoje";
            case "ultimos30dias":
                return "Últimos 30 dias";
            case "mensal":
                return "Este mês";
            default:
                return "";
        }
    };

    return (
        <DashboardLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold m-0 text-dark">Painel de Controle</h2>
                    <p className="text-muted m-0">Bem-vindo de volta! Aqui está o resumo do seu estoque e finanças.</p>
                </div>
                <div>
                    <select
                        className="form-select form-select-sm border-0 shadow-sm bg-white fw-medium text-secondary"
                        value={periodo}
                        onChange={(e) => setPeriodo(e.target.value)}
                    >
                        <option value="mensal">Este Mês</option>
                        <option value="hoje">Hoje</option>
                        <option value="ultimos30dias">Últimos 30 dias</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center mt-5 py-5">
                    <Spinner />
                </div>
            ) : (
                <>
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-sm-6 col-xl-3">
                            <div className="card border-0 shadow-sm p-3 bg-white h-100">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <span
                                            className="text-muted small d-block fw-medium text-uppercase">Entradas ({obterDescricaoPeriodo()})</span>
                                        <h3 className="fw-bold m-0 text-success mt-1">{formatarMoeda(faturamento)}</h3>
                                    </div>
                                    <div
                                        className="bg-success bg-opacity-10 text-success p-3 rounded-3 d-flex align-items-center justify-content-center">
                                        <i className="bi bi-graph-up-arrow fs-4"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-xl-3">
                            <div className="card border-0 shadow-sm p-3 bg-white h-100">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <span
                                            className="text-muted small d-block fw-medium text-uppercase">Saídas ({obterDescricaoPeriodo()})</span>
                                        <h3 className="fw-bold m-0 text-danger mt-1">{formatarMoeda(saida)}</h3>
                                    </div>
                                    <div
                                        className="bg-danger bg-opacity-10 text-danger p-3 rounded-3 d-flex align-items-center justify-content-center">
                                        <i className="bi bi-cash-stack fs-4"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-xl-3">
                            <div className="card border-0 shadow-sm p-3 bg-white h-100">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <span
                                            className="text-muted small d-block fw-medium text-uppercase">Total de Itens</span>
                                        <h3 className="fw-bold m-0 text-dark mt-1">{totalEstoque} <span
                                            className="fs-6 fw-normal text-muted">un</span></h3>
                                    </div>
                                    <div
                                        className="bg-primary bg-opacity-10 text-primary p-3 rounded-3 d-flex align-items-center justify-content-center">
                                        <i className="bi bi-box-seam fs-4"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-xl-3">
                            <div className="card border-0 shadow-sm bg-white h-100">
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <span className="text-muted small d-block fw-medium text-uppercase">
                                                Pedidos Pendentes
                                            </span>
                                            <h3 className="fw-bold m-0 text-warning mt-1">
                                                {pedidosPendentes}
                                                <span className="fs-6 fw-normal text-muted"> pedidos</span>
                                            </h3>
                                            <small className="text-muted">
                                                Valor total pendente:
                                                <span className="fw-bold text-dark ms-1">
                                                    {formatarMoeda(contas)}
                                                </span>
                                            </small>
                                        </div>
                                        <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-3 d-flex align-items-center justify-content-center">
                                            <i className="bi bi-hourglass-split fs-4"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-12 col-lg-8">
                            <div className="card border-0 shadow-sm p-4 bg-white h-100">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="fw-bold m-0 text-dark">Pedidos de Fornecedores Recentes</h5>
                                    <Link
                                        to={"/dashboard/fornecedores"}
                                        className={"btn btn-sm btn-link text-decoration-none p-0 text-primary fw-medium"}>
                                        Ver todos
                                    </Link>
                                </div>

                                {/* Espaço reservado para listar os pedidos inseridos pelo seu data.sql */}
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle m-0">
                                        <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Fornecedor</th>
                                            <th>Data do Pedido</th>
                                            <th>Vencimento</th>
                                            <th>Total</th>
                                            <th className="text-center">Status</th>
                                        </tr>
                                        </thead>
                                        <tbody className="table-border-bottom-0">
                                        {ultimosPedidos && ultimosPedidos.length > 0 ? (
                                            ultimosPedidos.map((pedido) => (
                                                <tr key={pedido.id}>
                                                    <td className="text-muted">#{pedido.id}</td>
                                                    <td className="fw-semibold">
                                                        {pedido.fornecedorNome}
                                                    </td>
                                                    <td>
                                                        {/* Formatação simples da data (DD/MM/AAAA) */}
                                                        {pedido.dataPedido
                                                            ? new Date(pedido.dataPedido).toLocaleDateString('pt-BR')
                                                            : "---"}
                                                    </td>
                                                    <td>
                                                        {/* Formatação simples da data (DD/MM/AAAA) */}
                                                        {pedido.dataVencimento
                                                            ? new Date(pedido.dataVencimento).toLocaleDateString('pt-BR')
                                                            : "---"}
                                                    </td>
                                                    <td className="fw-medium">
                                                        {formatarMoeda(pedido.valorTotal || pedido.total || 0)}
                                                    </td>
                                                    <td className="text-center">
                    <span className={`badge ${
                        pedido.status === 'PAGO'
                            ? 'bg-success-subtle text-success border border-success-subtle'
                            : 'bg-warning-subtle text-warning border border-warning-subtle'
                    } px-2.5 py-1.5 rounded-pill`}>
                        {pedido.status || 'PENDENTE'}
                    </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center text-muted py-3">
                                                    Nenhum pedido recente encontrado.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm p-4 bg-white h-100">
                        <h5 className="fw-bold mb-3 text-dark">Ações Rápidas</h5>
                        <div className="d-grid gap-3">
                            <Link
                                to={"/dashboard/pedidos/checkout"}
                                className={"btn btn-warning text-dark fw-bold d-flex align-items-center justify-content-center py-2.5 shadow-sm border-0"}>
                                <i className="bi bi-plus-circle-fill fs-5 me-2"></i> Novo Pedido de Compra
                            </Link>
                            <Link
                                to={"/dashboard/vendas/checkout"}
                                className={"btn btn-dark fw-medium d-flex align-items-center justify-content-center py-2.5 shadow-sm"}>
                                <i className="bi bi-box-arrow-in-down fs-5 me-2"></i> Adicionar Venda
                            </Link>
                        </div>

                        <hr className="my-4 text-muted"/>

                        <h5 className="fw-bold mb-2 text-dark">Status Operacional</h5>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent text-muted small">
                                Fornecedores Cadastrados: <strong className="text-dark">{totalFornecedor}</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent text-muted small">
                                Categorias Ativas: <strong className="text-dark">{totalCategoria}</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent text-muted small">
                                Marcas Cadastradas: <strong className="text-dark">{totalMarca}</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent text-muted small">
                                Pedidos Realizados na Semana: <strong className="text-dark">{totalPedido}</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent text-muted small">
                                Vendas Realizadas na Semana: <strong className="text-dark">{totalVenda}</strong>
                            </li>
                        </ul>
                    </div>
                </div>
                </div>
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

export default Dashboard;
