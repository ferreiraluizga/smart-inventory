import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import Toast from "../../components/ui/Toast.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import {categoriaService} from "../../services/categoriaService.js";
import DashboardCard from "../../components/ui/DashboardCard.jsx";

function VisualizarCategoria() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categoria, setCategoria] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ visivel: false, mensagem: "", tipo: "danger" });

    useEffect(() => {
        carregarDadosDaCategoria();
    }, [id]);

    const carregarDadosDaCategoria = async () => {
        try {
            setLoading(true);

            const dadosCategoria = await categoriaService.buscarPorId(id);
            setCategoria(dadosCategoria);

            const dadosProdutos = await categoriaService.listarProdutosPorCategoria(id);
            setProdutos(dadosProdutos || []);
        } catch (error) {
            console.error("Erro ao carregar dados da categoria:", error);
            setToast({ visivel: true, mensagem: "Erro ao carregar as informações do servidor.", tipo: "danger" });
        } finally {
            setLoading(false);
        }
    }

    const totalSkus = produtos.length;

    const totalUnidadesFisicas = produtos.reduce((acc, p) => acc + (Number(p.quantidade) || 0), 0);

    const valorTotalEstoque = produtos.reduce((acc, p) => acc + ((Number(p.preco) || 0) * (Number(p.quantidade) || 0)), 0);

    const produtoMaisCaro = produtos.length > 0
        ? produtos.reduce((max, p) => (p.preco > max.preco ? p : max), produtos[0])
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

    if (!categoria) {
        return (
            <DashboardLayout>
                <div className="alert alert-warning mt-4 d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>Categoria não encontrada no sistema.</div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate("/dashboard/categorias")}>
                    Voltar para Categorias
                </button>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <button className="btn btn-sm btn-outline-secondary mb-2" onClick={() => navigate("/dashboard/categorias")}>
                        <i className="bi bi-arrow-left me-1"></i> Voltar para Categorias
                    </button>
                    <h2 className="fw-bold m-0 text-dark">{categoria.nome}</h2>
                    <p className="text-muted m-0">Visão geral da categoria e catálogo de itens em estoque.</p>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <DashboardCard
                        icon="grid-3x3-gap"
                        iconBg="bg-primary bg-opacity-10 text-primary"
                        title="Variedade de Itens"
                        value={totalSkus}
                        unit={totalSkus === 1 ? "SKU" : "SKUs"}
                    />
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <DashboardCard
                        icon="cash-stack"
                        iconBg="bg-success bg-opacity-10 text-success"
                        title="Valor do Estoque"
                        value={valorTotalEstoque > 0 ? `R$ ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valorTotalEstoque)}` : "R$ 0,00"}
                    />
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <DashboardCard
                        icon="box-seam"
                        iconBg="bg-info bg-opacity-10 text-info"
                        title="Volume em Unidades"
                        value={totalUnidadesFisicas}
                        unit="unidades"
                    />
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <DashboardCard
                        icon="gem"
                        iconBg="bg-warning bg-opacity-10 text-warning"
                        title="Produto de Maior Preço"
                        value={produtoMaisCaro ? `#${produtoMaisCaro.id}` : "Nenhum"}
                        subtitle={produtoMaisCaro ? `${produtoMaisCaro.nome} (R$ ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(produtoMaisCaro.preco)})` : "Sem registros"}
                    />
                </div>
            </div>

            <div className="card border-0 shadow-sm p-4 bg-white">
                <h5 className="fw-bold mb-3 text-dark">Produtos da Categoria</h5>

                {produtos.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-info-circle fs-2 text-secondary"></i>
                        <p className="mt-2 mb-0">Nenhum produto está vinculado a esta categoria no momento.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle m-0">
                            <thead className="table-light">
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Nome do Produto</th>
                                <th>Marca</th>
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
                                    <td>{produto.marcaNome || <span className="text-muted">Sem marca</span>}</td>
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

export default VisualizarCategoria;