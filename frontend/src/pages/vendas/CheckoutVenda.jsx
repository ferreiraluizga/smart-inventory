import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { vendaService } from "../../services/vendaService";
import { produtoService } from "../../services/produtoService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Toast from "../../components/ui/Toast";
import Spinner from "../../components/ui/Spinner";

function CheckoutVenda() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ visivel: false, mensagem: "", tipo: "danger" });

    // Estados de dados da API
    const [produtos, setProdutos] = useState([]);
    const [busca, setBusca] = useState("");

    // Estado centralizador da venda (Carrinho e Metadados)
    const [vendaPayload, setVendaPayload] = useState({
        formaPagamento: "CARTAO", // Valor padrão inicial baseado no seu Enum
        itens: [] // Estrutura: [{ produtoId: X, nome: Y, preco: Z, quant: W, subtotal: K }]
    });

    const mostrarToast = (mensagem, tipo = "danger") => {
        setToast({ visivel: true, mensagem, tipo });
        setTimeout(() => setToast({ visivel: false, mensagem: "", tipo: "danger" }), 4000);
    };

    // Carrega todos os produtos disponíveis para venda ao entrar na página
    useEffect(() => {
        const carregarProdutos = async () => {
            try {
                setLoading(true);
                const dados = await produtoService.listarTodos();
                // Filtra apenas produtos ativos e com stock disponível
                const ativos = (dados || []).filter(p => p.ativo && p.quantidade > 0);
                setProdutos(ativos);
            } catch (error) {
                console.error("Erro ao carregar produtos para venda:", error);
                mostrarToast("Erro ao carregar a lista de produtos do servidor.");
            } finally {
                setLoading(false);
            }
        };
        carregarProdutos();
    }, []);

    // Filtro de pesquisa de produtos por nome em tempo real
    const produtosFiltrados = produtos.filter(p =>
        p.nome?.toLowerCase().includes(busca.toLowerCase())
    );

    const handleAtualizarQuantidade = (produto, novaQuantidade) => {
        // Valida se a quantidade solicitada não ultrapassa o stock disponível do produto
        if (novaQuantidade > produto.quantidade) {
            mostrarToast(`Stock insuficiente! Apenas ${produto.quantidade} unidades disponíveis.`, "warning");
            return;
        }

        setVendaPayload(prev => {
            const itemExistente = prev.itens.find(item => item.produtoId === produto.id);

            if (novaQuantidade <= 0) {
                return { ...prev, itens: prev.itens.filter(item => item.produtoId !== produto.id) };
            }

            if (itemExistente) {
                return {
                    ...prev,
                    itens: prev.itens.map(item =>
                        item.produtoId === produto.id
                            ? { ...item, quant: novaQuantidade, subtotal: novaQuantidade * produto.preco }
                            : item
                    )
                };
            } else {
                return {
                    ...prev,
                    itens: [...prev.itens, {
                        produtoId: produto.id,
                        nome: produto.nome,
                        preco: produto.preco,
                        quant: novaQuantidade,
                        subtotal: novaQuantidade * produto.preco
                    }]
                };
            }
        });
    };

    // Calcula o valor total geral somando os subtotais do carrinho
    const calcularTotalGeral = () => {
        return vendaPayload.itens.reduce((acc, item) => acc + item.subtotal, 0);
    };

    const handleFinalizarVenda = async () => {
        if (vendaPayload.itens.length === 0) {
            mostrarToast("Adicione pelo menos um produto ao carrinho para efetuar a venda.", "warning");
            return;
        }

        try {
            setLoading(true);

            // Mapeia os dados em variáveis locais
            const formaPagamento = vendaPayload.formaPagamento;
            const itens = vendaPayload.itens.map(item => ({
                produtoId: Number(item.produtoId),
                quant: Number(item.quant)
            }));

            // CORREÇÃO: Passa os dois parâmetros separados por vírgula para o serviço
            const novaVendaSalva = await vendaService.salvar(formaPagamento, itens);

            navigate("/dashboard/vendas", {
                state: { novaVenda: novaVendaSalva }
            });

        } catch (error) {
            console.error("Erro ao processar venda:", error);
            const msg = error.response?.data?.message || "Não foi possível registar a venda no servidor.";
            mostrarToast(msg, "danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            {/* CABEÇALHO */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Registrar Venda</h2>
                    <p className="text-muted mb-0">Selecione os produtos e finalize a transação.</p>
                </div>
                <button className="btn btn-outline-secondary px-3" onClick={() => navigate("/dashboard/vendas")}>
                    <i className="bi bi-arrow-left me-2"></i>Voltar
                </button>
            </div>

            {loading && produtos.length === 0 ? (
                <Spinner />
            ) : (
                <div className="row g-4">
                    {/* COLUNA ESQUERDA: VITRINE DE PRODUTOS */}
                    <div className="col-12 col-lg-8">
                        <div className="card shadow-sm border-0 rounded-3 p-4 bg-white mb-4">
                            <div className="input-group mb-4 rounded-3 shadow-sm">
                                <span className="input-group-text bg-white border-end-0 text-muted">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Pesquisar produto pelo nome..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                />
                            </div>

                            <div className="row row-cols-1 row-cols-md-2 g-3" style={{ maxHeight: "calc(100vh - 280px)", overflowY: "auto" }}>
                                {produtosFiltrados.map(prod => {
                                    const itemNoCarrinho = vendaPayload.itens.find(item => item.produtoId === prod.id);
                                    const qtdAtual = itemNoCarrinho ? itemNoCarrinho.quant : 0;

                                    return (
                                        <div className="col" key={prod.id}>
                                            <div className="card h-100 border-light shadow-sm p-3 rounded-3 position-relative">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <h6 className="fw-bold text-dark mb-1 text-truncate" style={{ maxWidth: "200px" }}>{prod.nome}</h6>
                                                        <small className="text-muted d-block">{prod.marcaNome || "Sem marca"}</small>
                                                    </div>
                                                    <span className={`badge ${prod.quantidade <= 5 ? "bg-danger-subtle text-danger" : "bg-light text-dark"} border`}>
                                                        Stock: {prod.quantidade}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                                                    <span className="fw-bold text-primary fs-5">
                                                        {prod.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                    </span>

                                                    {/* CONTROLES DE QUANTIDADE */}
                                                    {qtdAtual === 0 ? (
                                                        <button
                                                            className="btn btn-warning btn-sm px-3 rounded-2 fw-semibold shadow-sm"
                                                            onClick={() => handleAtualizarQuantidade(prod, 1)}
                                                        >
                                                            <i className="bi bi-cart-plus me-1"></i> Adicionar
                                                        </button>
                                                    ) : (
                                                        <div className="d-flex align-items-center gap-2 bg-light rounded-2 border px-1">
                                                            <button className="btn btn-sm text-danger border-0 px-2" onClick={() => handleAtualizarQuantidade(prod, qtdAtual - 1)}>
                                                                <i className="bi bi-dash-lg fw-bold"></i>
                                                            </button>
                                                            <span className="fw-bold text-dark px-1" style={{ minWidth: "20px", textAlign: "center" }}>{qtdAtual}</span>
                                                            <button className="btn btn-sm text-success border-0 px-2" onClick={() => handleAtualizarQuantidade(prod, qtdAtual + 1)}>
                                                                <i className="bi bi-plus-lg fw-bold"></i>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* COLUNA DIREITA: RESUMO DO CARRINHO & FINALIZAÇÃO */}
                    <div className="col-12 col-lg-4">
                        <div className="card shadow-sm border-0 rounded-3 p-4 bg-white sticky-lg-top" style={{ top: "2rem" }}>
                            <h5 className="fw-bold text-secondary mb-3 pb-2 border-bottom">
                                <i className="bi bi-cart3 me-2 text-warning"></i>Carrinho de Compras
                            </h5>

                            {/* LISTA DE ITENS SELECIONADOS */}
                            <div className="mb-4" style={{ maxHeight: "240px", overflowY: "auto" }}>
                                {vendaPayload.itens.length === 0 ? (
                                    <div className="text-center text-muted py-4">
                                        <i className="bi bi-cart-x fs-2 d-block mb-1"></i>
                                        <small>Nenhum produto adicionado.</small>
                                    </div>
                                ) : (
                                    vendaPayload.itens.map(item => (
                                        <div className="d-flex justify-content-between align-items-center border-bottom border-light py-2" key={item.produtoId}>
                                            <div style={{ maxWidth: "160px" }}>
                                                <span className="d-block fw-semibold text-dark text-truncate small">{item.nome}</span>
                                                <small className="text-muted" style={{ fontSize: "11px" }}>{item.quant}x {item.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</small>
                                            </div>
                                            <span className="fw-bold text-secondary small">
                                                {item.subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* CONFIGURAÇÃO DO MEIO DE PAGAMENTO */}
                            <div className="mb-4 pt-2 border-top">
                                <label className="form-label fw-bold text-dark small">Forma de Pagamento</label>
                                <select
                                    className="form-select rounded-3 shadow-sm"
                                    value={vendaPayload.formaPagamento}
                                    onChange={(e) => setVendaPayload(prev => ({ ...prev, formaPagamento: e.target.value }))}
                                >
                                    <option value="CARTAO">Cartão de Crédito/Débito</option>
                                    <option value="PIX">PIX</option>
                                    <option value="DINHEIRO">Dinheiro</option>
                                </select>
                            </div>

                            {/* TOTALIZADOR E BOTÃO FINAL */}
                            <div className="bg-light rounded-3 p-3 mb-3 border d-flex justify-content-between align-items-center">
                                <span className="fw-semibold text-muted">Valor Total:</span>
                                <strong className="fs-4 text-dark">
                                    {calcularTotalGeral().toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </strong>
                            </div>

                            <button
                                className="btn btn-warning w-100 py-2.5 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                                onClick={handleFinalizarVenda}
                                disabled={loading || vendaPayload.itens.length === 0}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle-fill"></i>
                                        <span>Concluir Venda</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
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

export default CheckoutVenda;