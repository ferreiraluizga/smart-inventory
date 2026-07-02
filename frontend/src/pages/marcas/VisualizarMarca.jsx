import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { marcaService } from "../../services/marcaService"; // Ajuste o caminho se necessário
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/ui/Spinner";
import Toast from "../../components/ui/Toast";

function VisualizarMarca() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [marca, setMarca] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ visivel: false, mensaje: "", tipo: "danger" });

    useEffect(() => {
        carregarDadosDaMarca();
    }, [id]);

    const carregarDadosDaMarca = async () => {
        try {
            setLoading(true);

            // 1. Busca os detalhes da marca (contendo o nome e a quantidadeProdutos)
            const dadosMarca = await marcaService.buscarPorId(id);
            setMarca(dadosMarca);

            // 2. Busca a lista real de produtos vinculados
            const dadosProdutos = await marcaService.listarProdutosPorMarca(id);
            setProdutos(dadosProdutos || []);
        } catch (error) {
            console.error("Erro ao carregar dados da marca:", error);
            setToast({ visivel: true, mensagem: "Erro ao carregar as informações do servidor.", tipo: "danger" });
        } finally {
            setLoading(false);
        }
    };

    // 1. Índice de Disponibilidade: % de produtos desta marca que estão ativos
    const produtosAtivos = produtos.filter(p => p.ativo).length;
    const indiceDisponibilidade = produtos.length > 0
        ? (produtosAtivos / produtos.length) * 100
        : 0;

// 2. Concentração de Stock: Total de unidades físicas que esta marca representa
    const totalUnidadesMarca = produtos.reduce((acc, p) => acc + (p.quantidade || 0), 0);

// 3. Produto Líder da Marca: O produto com maior quantidade em stock
    const produtoLider = produtos.length > 0
        ? [...produtos].sort((a, b) => b.quantidade - a.quantidade)[0]
        : null;

    if (loading) {
        return (
            <DashboardLayout>
                <div className="d-flex justify-content-center align-items-center mt-5 py-5">
                    <Spinner />
                </div>
            </DashboardLayout>
        );
    }

    if (!marca) {
        return (
            <DashboardLayout>
                <div className="alert alert-warning mt-4 d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>Marca não encontrada no sistema.</div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate("/dashboard/marcas")}>
                    Voltar para Marcas
                </button>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Cabeçalho superior com botão Voltar */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <button className="btn btn-sm btn-outline-secondary mb-2" onClick={() => navigate("/dashboard/marcas")}>
                        <i className="bi bi-arrow-left me-1"></i> Voltar para Marcas
                    </button>
                    <h2 className="fw-bold m-0 text-dark">{marca.nome}</h2>
                    <p className="text-muted m-0">Visão geral do fabricante e catálogo de itens em estoque.</p>
                </div>
            </div>

            {/* Bloco de Indicadores Resumidos Focados na Marca */}
            <div className="row g-3 mb-4">
                {/* Card 1: Variedade (Mapeado do DTO do Banco) */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3 bg-white h-100">
                        <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 text-primary p-3 rounded me-3">
                                <i className="bi bi-bookmark-star fs-4"></i>
                            </div>
                            <div>
                                <h6 className="text-muted mb-1 text-uppercase small fw-bold">Variedade Regulamentada</h6>
                                <h3 className="fw-bold mb-0">{marca.quantidadeProdutos || 0} <span className="fs-6 text-muted fw-normal">SKUs</span></h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Índice de Disponibilidade da Marca */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3 bg-white h-100">
                        <div className="d-flex align-items-center">
                            <div className={`p-3 rounded me-3 ${indiceDisponibilidade > 75 ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                                <i className="bi bi-activity fs-4"></i>
                            </div>
                            <div>
                                <h6 className="text-muted mb-1 text-uppercase small fw-bold">Saúde do Catálogo</h6>
                                <h3 className="fw-bold mb-0">{indiceDisponibilidade.toFixed(0)}% <span className="fs-6 text-muted fw-normal">ativo</span></h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3: Volume de Carga (Dependência de Armazém) */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3 bg-white h-100">
                        <div className="d-flex align-items-center">
                            <div className="bg-info bg-opacity-10 text-info p-3 rounded me-3">
                                <i className="bi bi-boxes fs-4"></i>
                            </div>
                            <div>
                                <h6 className="text-muted mb-1 text-uppercase small fw-bold">Volume Total Físico</h6>
                                <h3 className="fw-bold mb-0">{totalUnidadesMarca} <span className="fs-6 text-muted fw-normal">unidades</span></h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 4: Produto Carro-Chefe da Marca */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3 bg-white h-100">
                        <div className="d-flex align-items-center">
                            <div className="bg-dark bg-opacity-10 text-dark p-3 rounded me-3">
                                <i className="bi bi-award fs-4"></i>
                            </div>
                            <div className="overflow-hidden">
                                <h6 className="text-muted mb-1 text-uppercase small fw-bold">Principal Produto</h6>
                                <h6 className="fw-bold mb-0 text-truncate" title={produtoLider ? produtoLider.nome : "Nenhum"}>
                                    {produtoLider ? produtoLider.nome : "Nenhum"}
                                </h6>
                                <small className="text-muted text-xs">
                                    {produtoLider ? `(${produtoLider.quantidade} un em stock)` : "Sem registos"}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Listagem de produtos em tabela */}
            <div className="card border-0 shadow-sm p-4 bg-white">
                <h5 className="fw-bold mb-3 text-dark">Produtos da Marca</h5>

                {produtos.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-info-circle fs-2 text-secondary"></i>
                        <p className="mt-2 mb-0">Nenhum produto está vinculado a este fabricante no momento.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle m-0">
                            <thead className="table-light">
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Nome do Produto</th>
                                <th>Categoria</th>
                                <th>Estoque</th>
                                <th>Preço</th>
                                <th className="text-center">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {produtos.map((produto) => (
                                <tr key={produto.id}>
                                    <td className="text-muted">#{produto.id}</td>
                                    <td className="fw-semibold text-dark">{produto.nome}</td>
                                    <td>{produto.categoriaNome || <span className="text-muted">Sem categoria</span>}</td>
                                    <td>{produto.quantidade} un</td>
                                    <td>
                                        {produto.preco ? `R$ ${produto.preco.toFixed(2)}` : 'R$ 0,00'}
                                    </td>
                                    <td className="text-center">
                                            <span className={`badge px-2.5 py-1.5 rounded-pill ${
                                                produto.ativo
                                                    ? 'bg-success-subtle text-success border border-success-subtle'
                                                    : 'bg-danger-subtle text-danger border border-danger-subtle'
                                            }`}>
                                                {produto.ativo ? 'Ativo' : 'Inativo'}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Toast
                visivel={toast.visivel}
                mensagem={toast.mensagem}
                tipo={toast.tipo}
                onClose={() => setToast({ ...toast, visivel: false })}
            />
        </DashboardLayout>
    );
}

export default VisualizarMarca;
