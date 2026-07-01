import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {pedidoService} from "../../services/pedidoService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Toast from "../../components/ui/Toast";
import Spinner from "../../components/ui/Spinner";
import {fornecedorService} from "../../services/fornecedorService.js";
import {produtoService} from "../../services/produtoService.js";

function CheckoutPedido() {
    const navigate = useNavigate();

    // Controle do fluxo (Etapas: 1, 2 ou 3)
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({visivel: false, mensagem: "", tipo: "danger"});

    // Dados que vêm do banco através da API
    const [fornecedores, setFornecedores] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [buscaFiltro, setBuscaFiltro] = useState("");

    // O estado centralizador do nosso pedido completo
    const [pedidoPayload, setPedidoPayload] = useState({
        fornecedorId: "",
        fornecedorNome: "",
        dataVencimento: "",
        itens: [] // Estrutura enviada ao Java: [{ produtoId: X, quant: Y }]
    });

    const mostrarToast = (mensagem, tipo = "danger") => {
        setToast({visivel: true, mensagem, tipo});
        setTimeout(() => setToast({visivel: false, mensagem: "", tipo: "danger"}), 4000);
    };

    // 2. DISPARA A CARGA DE FORNECEDORES SE ESTIVER NA ETAPA 1
    useEffect(() => {
        if (step === 1) {
            carregarFornecedores();
        }
    }, [step]);

    const carregarFornecedores = async () => {
        try {
            setLoading(true);
            const dados = await fornecedorService.listarTodos();
            setFornecedores(dados || []);
        } catch (error) {
            console.error("Erro ao carregar fornecedores:", error);
            mostrarToast("Erro ao carregar lista de fornecedores do servidor.");
        } finally {
            setLoading(false);
        }
    };

    // 3. AÇÃO AO CLICAR NO FORNECEDOR (Prepara dados e avança para etapa 2)
    const handleSelecionarFornecedor = async (fornecedor) => {
        try {
            setLoading(true);
            setPedidoPayload({
                fornecedorId: fornecedor.id,
                fornecedorNome: fornecedor.nome,
                dataVencimento: "", // Será definida na etapa 3
                itens: [] // Limpa o carrinho para segurança do fluxo
            });

            // 1. Busca TODOS os produtos do servidor através do produtoService
            const todosOsProdutos = await produtoService.listarTodos();

            // 2. Filtra no front-end mantendo apenas os produtos que pertencem ao fornecedor selecionado
            // Certifique-se de que a propriedade no seu objeto Produto se chama 'fornecedorId' ou 'fornecedor.id'
            const filtrados = (todosOsProdutos || []).filter(p =>
                p.fornecedorId === fornecedor.id || p.fornecedor?.id === fornecedor.id
            );

            setProdutos(filtrados);
            setBuscaFiltro(""); // Limpa a barra de pesquisa
            setStep(2); // Avança continuamente para a etapa de produtos
        } catch (error) {
            console.error("Erro ao carregar e filtrar produtos:", error);
            mostrarToast("Erro ao buscar e filtrar os produtos deste fornecedor.");
        } finally {
            setLoading(false);
        }
    };

    // Filtro em tempo real de fornecedores baseado na digitação do usuário
    const fornecedoresFiltrados = fornecedores.filter(f =>
        f.nome?.toLowerCase().includes(buscaFiltro.toLowerCase())
    );

    const handleAtualizarQuantidade = (produtoId, quantidade) => {
        setPedidoPayload(prev => {
            const itemExistente = prev.itens.find(item => item.produtoId === produtoId);

            // Se a quantidade chegar a 0, remove o produto do carrinho
            if (quantidade <= 0) {
                return {...prev, itens: prev.itens.filter(item => item.produtoId !== produtoId)};
            }

            // Se o produto já estava no carrinho, atualiza a quantidade dele
            if (itemExistente) {
                return {
                    ...prev,
                    itens: prev.itens.map(item =>
                        item.produtoId === produtoId ? {...item, quant: quantidade} : item
                    )
                };
            } else {
                // Se for um produto novo, adiciona no array de itens
                return {...prev, itens: [...prev.itens, {produtoId, quant: quantidade}]};
            }
        });
    };

    const handleFinalizarPedido = async () => {
        if (!pedidoPayload.dataVencimento) {
            mostrarToast("Por favor, defina uma data de vencimento válida.", "warning");
            return;
        }

        try {
            setLoading(true);

            const dataVencimentoFormatada = pedidoPayload.dataVencimento.includes('T')
                ? pedidoPayload.dataVencimento.split('T')[0]
                : pedidoPayload.dataVencimento;

            const itensFormatados = pedidoPayload.itens.map(item => ({
                produtoId: Number(item.produtoId),
                quant: Number(item.quant)
            }));

            // 1. Recebe o novo pedido criado que o seu Spring Boot retorna no corpo da resposta
            const novoPedidoSalvo = await pedidoService.salvar(
                Number(pedidoPayload.fornecedorId),
                dataVencimentoFormatada,
                null,
                itensFormatados
            );

            // 2. EQUIVALENTE AO onCadastrar: Navega enviando o objeto para a tela de listagem
            navigate("/dashboard/pedidos", {
                state: {
                    novoPedido: novoPedidoSalvo
                }
            });

        } catch (error) {
            console.error("Erro ao registrar pedido:", error);
            const mensagemServidor = error.response?.data?.message || "Não foi possível salvar o pedido no servidor.";
            mostrarToast(mensagemServidor, "danger");
        } finally {
            setLoading(false);
        }
    };

    // Controla o retorno lógico entre as telas
    const handleVoltar = () => {
        if (step === 1) navigate("/dashboard/pedidos");
        else setStep(step - 1);
    };

    return (
        <DashboardLayout>
            {/* CABEÇALHO DA TELA */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Novo Pedido por Etapas</h2>
                    <p className="text-muted mb-0">Preencha as informações para registrar o pedido no estoque.</p>
                </div>
                <button className="btn btn-outline-secondary px-3" onClick={handleVoltar}>
                    <i className="bi bi-arrow-left me-2"></i>Voltar
                </button>
            </div>

            {/* VISUAL INDICADOR DE ETAPAS (MODERNO, LARGURA TOTAL & COR: WARNING) */}
            <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
                {/* Removemos o maxWidth para que o container ocupe 100% da largura útil do card */}
                <div className="d-flex justify-content-between position-relative align-items-center w-100"
                     style={{padding: "0 22px"}}>

                    {/* 1. LINHA CINZA DE FUNDO (Fixa de ponta a ponta) */}
                    <div
                        className="position-absolute bg-secondary-subtle"
                        style={{
                            zIndex: 0,
                            height: "4px",
                            borderRadius: "2px",
                            left: "45px",  // Alinhado perfeitamente no centro do círculo 01
                            right: "45px", // Alinhado perfeitamente no centro do círculo 03
                            top: "50%",
                            transform: "translateY(-50%)"
                        }}
                    ></div>

                    {/* 2. LINHA AMARELA ATIVA (Usa porcentagem dinâmica baseada na distância dos trilhos) */}
                    <div
                        className="position-absolute bg-warning transition-all"
                        style={{
                            zIndex: 0,
                            height: "4px",
                            borderRadius: "2px",
                            left: "45px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            transition: "0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: "0 0 12px rgba(255, 193, 7, 0.5)",

                            // Usando a largura proporcional calculada com 'calc' para descontar os 90px totais de margem das pontas
                            width: step === 1 ? "0%" : step === 2 ? "calc(50% - 22.5px)" : "calc(100% - 90px)"
                        }}
                    ></div>

                    {/* Passo 1: Fornecedor */}
                    <div className="position-relative" style={{zIndex: 1}} title="Fornecedor">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center border fw-bold transition-all"
                            style={{
                                width: "45px",
                                height: "45px",
                                fontSize: "0.95rem",
                                transition: "0.3s ease",
                                backgroundColor: step >= 1 ? '#ffc107' : '#ffffff',
                                color: step >= 1 ? '#000000' : '#6c757d',
                                borderColor: step >= 1 ? '#ffc107' : '#dee2e6',
                                boxShadow: step === 1 ? "0 0 15px rgba(255, 193, 7, 0.6)" : "none",
                                transform: step === 1 ? "scale(1.1)" : "scale(1)"
                            }}
                        >
                            {step > 1 ? <i className="bi bi-check-lg fs-5 fw-bold"></i> : "01"}
                        </div>
                    </div>

                    {/* Passo 2: Produtos */}
                    <div className="position-relative" style={{zIndex: 1}} title="Produtos">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center border fw-bold transition-all"
                            style={{
                                width: "45px",
                                height: "45px",
                                fontSize: "0.95rem",
                                transition: "0.3s ease",
                                backgroundColor: step >= 2 ? '#ffc107' : '#ffffff',
                                color: step >= 2 ? '#000000' : '#6c757d',
                                borderColor: step >= 2 ? '#ffc107' : '#dee2e6',
                                boxShadow: step === 2 ? "0 0 15px rgba(255, 193, 7, 0.6)" : "none",
                                transform: step === 2 ? "scale(1.1)" : "scale(1)"
                            }}
                        >
                            {step > 3 ? <i className="bi bi-check-lg fs-5 fw-bold"></i> : "02"}
                        </div>
                    </div>

                    {/* Passo 3: Resumo & Vencimento */}
                    <div className="position-relative" style={{zIndex: 1}} title="Resumo">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center border fw-bold transition-all"
                            style={{
                                width: "45px",
                                height: "45px",
                                fontSize: "0.95rem",
                                transition: "0.3s ease",
                                backgroundColor: step === 3 ? '#ffc107' : '#ffffff',
                                color: step === 3 ? '#000000' : '#6c757d',
                                borderColor: step === 3 ? '#ffc107' : '#dee2e6',
                                boxShadow: step === 3 ? "0 0 15px rgba(255, 193, 7, 0.6)" : "none",
                                transform: step === 3 ? "scale(1.1)" : "scale(1)"
                            }}
                        >
                            {"03"}
                        </div>
                    </div>

                </div>
            </div>

            {/* CONTAINER DAS ETAPAS (VAMOS PREENCHER CADA UMA DELAS) */}
            <div className="card shadow-sm border-0 rounded-3 p-4">
                {loading ? (
                    <Spinner/>
                ) : (
                    <>
                        {step === 1 && (
                            <div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-secondary mb-2">Selecione o Fornecedor
                                        do Pedido</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0 text-muted">
                                            <i className="bi bi-search"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-start-0 ps-1"
                                            placeholder="Digite o nome para filtrar fornecedores..."
                                            value={buscaFiltro}
                                            onChange={(e) => setBuscaFiltro(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="list-group rounded-3 overflow-hidden shadow-sm">
                                    {fornecedoresFiltrados.length === 0 ? (
                                        <div className="text-center text-muted p-4 bg-light">
                                            <i className="bi bi-building-x fs-3"></i>
                                            <p className="mt-2 mb-0">Nenhum fornecedor cadastrado ou encontrado.</p>
                                        </div>
                                    ) : (
                                        fornecedoresFiltrados.map(f => (
                                            <button
                                                key={f.id}
                                                type="button"
                                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3"
                                                onClick={() => handleSelecionarFornecedor(f)}
                                            >
                                                <div>
                                                    <span className="fw-semibold text-dark d-block">{f.nome}</span>
                                                    <small className="text-muted">CNPJ /
                                                        Documento: {f.cnpj || "Não informado"} | ID: #{f.id}</small>
                                                </div>
                                                <i className="bi bi-chevron-right text-success fs-5"></i>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div>
                                <div
                                    className="alert alert-warning-subtle bg-warning-subtle border border-warning-subtle rounded-3 p-3 mb-4 d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="text-secondary d-block text-uppercase small fw-bold">Fornecedor Escolhido</span>
                                        <strong
                                            className="text-success-emphasis fs-5">{pedidoPayload.fornecedorNome}</strong>
                                    </div>
                                    <button className="btn btn-sm btn-outline-dark" onClick={() => setStep(1)}>
                                        <i className="bi bi-arrow-left-right me-1"></i>Mudar
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-secondary mb-2">Adicione os Itens
                                        ao Pedido</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0 text-muted">
                                            <i className="bi bi-search"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-start-0 ps-1"
                                            placeholder="Filtrar produtos por nome..."
                                            value={buscaFiltro}
                                            onChange={(e) => setBuscaFiltro(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="table-responsive border rounded-3 mb-4">
                                    <table className="table align-middle m-0">
                                        <thead className="table-light text-secondary">
                                        <tr>
                                            <th className="ps-4">Produto</th>
                                            <th style={{width: "160px"}} className="text-center">Quantidade</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {produtos.filter(p => p.nome?.toLowerCase().includes(buscaFiltro.toLowerCase())).length === 0 ? (
                                            <tr>
                                                <td colSpan="2" className="text-muted text-center py-4">
                                                    Nenhum produto encontrado para este fornecedor.
                                                </td>
                                            </tr>
                                        ) : (
                                            produtos
                                                .filter(p => p.nome?.toLowerCase().includes(buscaFiltro.toLowerCase()))
                                                .map(p => {
                                                    const itemNoCarrinho = pedidoPayload.itens.find(item => item.produtoId === p.id);
                                                    const quantidadeAtual = itemNoCarrinho ? itemNoCarrinho.quant : 0;

                                                    return (
                                                        <tr key={p.id}>
                                                            <td className="ps-4">
                                                                    <span
                                                                        className="fw-semibold text-dark d-block">{p.nome}</span>
                                                                <small className="text-muted">ID:
                                                                    #{p.id} {p.preco ? `| Preço: R$ ${p.preco.toFixed(2)}` : ''}</small>
                                                            </td>
                                                            <td>
                                                                <div
                                                                    className="input-group input-group-sm justify-content-center">
                                                                    {/* Botão de Subtrair */}
                                                                    <button
                                                                        className="btn btn-outline-secondary"
                                                                        type="button"
                                                                        onClick={() => handleAtualizarQuantidade(p.id, quantidadeAtual - 1)}
                                                                        disabled={quantidadeAtual === 0}
                                                                    >
                                                                        <i className="bi bi-dash"></i>
                                                                    </button>

                                                                    {/* Input editável (readOnly removido) */}
                                                                    <input
                                                                        type="text"
                                                                        className="form-control text-center bg-white border-secondary-subtle"
                                                                        style={{
                                                                            maxWidth: "60px",
                                                                            fontWeight: "600"
                                                                        }}
                                                                        value={quantidadeAtual === 0 ? "" : quantidadeAtual} // Se for zero, deixa em branco para facilitar a digitação
                                                                        placeholder="0"
                                                                        onChange={(e) => {
                                                                            const valorDigitado = e.target.value;

                                                                            // Permite apagar o campo completamente para digitar um novo número
                                                                            if (valorDigitado === "") {
                                                                                handleAtualizarQuantidade(p.id, 0);
                                                                                return;
                                                                            }

                                                                            // Expressão regular que aceita apenas dígitos numéricos inteiros
                                                                            if (/^\d+$/.test(valorDigitado)) {
                                                                                handleAtualizarQuantidade(p.id, parseInt(valorDigitado, 10));
                                                                            }
                                                                        }}
                                                                    />

                                                                    {/* Botão de Somar */}
                                                                    <button
                                                                        className="btn btn-outline-secondary"
                                                                        type="button"
                                                                        onClick={() => handleAtualizarQuantidade(p.id, quantidadeAtual + 1)}
                                                                    >
                                                                        <i className="bi bi-plus"></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                        )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted">
                                        Itens no carrinho: <strong
                                        className="text-dark">{pedidoPayload.itens.length}</strong>
                                    </span>
                                    <button
                                        className="btn btn-warning px-4 fw-semibold"
                                        onClick={() => {
                                            setBuscaFiltro(""); // Limpa filtro de busca para a etapa 3
                                            setStep(3); // Avança para a Etapa 3 (Resumo)
                                        }}
                                        disabled={pedidoPayload.itens.length === 0} // Só avança se tiver adicionado ao menos 1 item
                                    >
                                        Avançar para o Resumo<i className="bi bi-arrow-right ms-2"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div>
                                <h4 className="fw-bold text-dark mb-3">Revisão do Pedido</h4>
                                <p className="text-muted mb-4">Confira os itens selecionados e defina a data de
                                    vencimento da fatura deste pedido.</p>

                                {/* Informações Consolidadas */}
                                <div className="row g-3 mb-4">
                                    <div className="col-12">
                                        <div
                                            className="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-center">
                                            <span className="text-secondary d-block text-uppercase small fw-bold mb-1">Fornecedor Selecionado</span>
                                            <strong className="text-dark fs-5">{pedidoPayload.fornecedorNome}</strong>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="p-3 border rounded-3 bg-light">
                                            <label
                                                className="form-label text-secondary text-uppercase small fw-bold mb-1">Definir
                                                Vencimento</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                // CORREÇÃO 1: Bloqueia visualmente datas passadas no calendário nativo
                                                min={new Date().toISOString().split('T')[0]}
                                                value={pedidoPayload.dataVencimento}
                                                onChange={(e) => {
                                                    const dataEscolhida = e.target.value;
                                                    const hoje = new Date().toISOString().split('T')[0];

                                                    // CORREÇÃO 2: Caso o usuário digite manualmente, reseta se for menor que hoje
                                                    if (dataEscolhida && dataEscolhida < hoje) {
                                                        mostrarToast("A data de vencimento não pode ser menor que hoje.", "warning");
                                                        setPedidoPayload({ ...pedidoPayload, dataVencimento: "" });
                                                    } else {
                                                        setPedidoPayload({ ...pedidoPayload, dataVencimento: dataEscolhida });
                                                    }
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tabela Resumida de Itens com Subtotais */}
                                <h5 className="fw-semibold text-secondary mb-3">Itens Escolhidos</h5>
                                <div className="table-responsive border rounded-3 mb-4">
                                    <table className="table align-middle m-0">
                                        <thead className="table-light text-secondary">
                                        <tr>
                                            <th className="ps-4">Produto</th>
                                            <th style={{width: "120px"}} className="text-center">Preço Unit.</th>
                                            <th style={{width: "120px"}} className="text-center">Quantidade</th>
                                            <th style={{width: "140px"}} className="text-end pe-4">Subtotal</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {pedidoPayload.itens.map(item => {
                                            const dadosProduto = produtos.find(p => p.id === item.produtoId);
                                            const precoUnitario = dadosProduto?.preco || 0;
                                            const subtotalItem = precoUnitario * item.quant;

                                            return (
                                                <tr key={item.produtoId}>
                                                    <td className="ps-4">
                                    <span className="fw-semibold text-dark d-block">
                                        {dadosProduto ? dadosProduto.nome : "Produto não identificado"}
                                    </span>
                                                        <small className="text-muted">ID do Item:
                                                            #{item.produtoId}</small>
                                                    </td>
                                                    <td className="text-center text-muted">
                                                        R$ {precoUnitario.toLocaleString('pt-BR', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                    </td>
                                                    <td className="text-center fw-semibold text-dark">
                                                        {item.quant} un
                                                    </td>
                                                    <td className="text-end pe-4 fw-bold text-dark">
                                                        R$ {subtotalItem.toLocaleString('pt-BR', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                        {/* Linha de Total Geral da Compra */}
                                        <tr className="table-light border-top-2">
                                            <td colSpan="3" className="text-end fw-bold text-secondary py-3">Total do
                                                Pedido:
                                            </td>
                                            <td className="text-end pe-4 fw-bold text-success fs-5 py-3">
                                                R$ {pedidoPayload.itens.reduce((acumulador, item) => {
                                                const dadosProduto = produtos.find(p => p.id === item.produtoId);
                                                return acumulador + ((dadosProduto?.preco || 0) * item.quant);
                                            }, 0).toLocaleString('pt-BR', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Botões de Navegação Inferiores */}
                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary px-4"
                                        onClick={() => setStep(2)}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>Ajustar Itens
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-success px-5 fw-semibold shadow-sm"
                                        onClick={handleFinalizarPedido}
                                        disabled={pedidoPayload.itens.length === 0 || !pedidoPayload.dataVencimento}
                                    >
                                        <i className="bi bi-send-check-fill me-2"></i>Concluir e Enviar Pedido
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Toast
                visivel={toast.visivel}
                mensagem={toast.mensagem}
                tipo={toast.tipo}
                onClose={() => setToast({...toast, visivel: false})}
            />
        </DashboardLayout>
    );
}

export default CheckoutPedido;