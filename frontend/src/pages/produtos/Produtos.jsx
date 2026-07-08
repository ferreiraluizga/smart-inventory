import {useEffect, useState} from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Header from "../../components/ui/Header";
import {produtoService} from "../../services/produtoService"
import Modal from "../../components/ui/Modal";
import FormCadastrarProduto from "./FormCadastrarProduto";
import Toast from "../../components/ui/Toast";
import Card from "../../components/ui/Card";
import ModalConfirmacao from "../../components/ui/ModalConfirmacao";
import Spinner from "../../components/ui/Spinner";
import FormEditarProduto from "./FormEditarProduto";

function Produtos() {
    const [produtos, setProdutos] = useState([]);
    const [busca, setBusca] = useState("");

    const [toast, setToast] = useState({visivel: false, mensagem: "", tipo: "danger"});

    const [loading, setLoading] = useState(true);

    const mostrarToast = (mensagem, tipo = "danger") => {
        setToast({visivel: true, mensagem, tipo});
        setTimeout(() => {
            setToast({visivel: false, mensagem: "", tipo: "danger"});
        }, 4000);
    };

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try {
            setLoading(true)
            const dados = await produtoService.listarTodos();
            setProdutos(dados || []);
        } catch (error) {
            console.error("Erro ao listar os produtos: ", error);
            mostrarToast("Erro ao carregar a lista de produtos do servidor.");
        } finally {
            setLoading(false);
        }
    }

    const produtosFiltrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(busca.toLowerCase())
    );

    const handleProdutoCriado = (novoProduto) => {
        setProdutos((produtosAnteriores) => [...produtosAnteriores, novoProduto]);
        mostrarToast("Produto cadastrado com sucesso!", "success");

        const modalElement = document.getElementById("modalProduto");
        if (modalElement) {
            const btnFechar = modalElement.querySelector('[data-bs-dismiss="modal"]');
            if (btnFechar) {
                btnFechar.click();
            }
        }
    }

    const handleProdutoAtualizado = (produtoEditado) => {
        setProdutos((produtosAnteriores) =>
            produtosAnteriores.map((p) => (p.id === produtoEditado.id ? produtoEditado : p))
        );
        mostrarToast("Produto atualizado com sucesso!", "success");

        const modalElement = document.getElementById(`modalEditarProduto-${produtoEditado.id}`);
        if (modalElement) {
            const btnFechar = modalElement.querySelector('[data-bs-dismiss="modal"]');
            if (btnFechar) btnFechar.click();
        }
    }

    const handleProdutoExcluido = async (id) => {
        try {
            await produtoService.excluir(id);
            setProdutos((produtosAnteriores) => produtosAnteriores.filter((p) => p.id !== id));
            mostrarToast("Produto excluído com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao excluir produto:", error);
            mostrarToast("Não foi possível excluir o produto.");
        }
    }

    const handleProdutoErro = (mensagemErro) => {
        mostrarToast(mensagemErro, "danger");
    };

    return (
        <DashboardLayout>
            <Header
                titulo="Produtos"
                descricao="Gerencie os produtos do estoque."
                searchPlaceholder="Buscar produto..."
                searchValue={busca}
                searchOnChange={(e) => setBusca(e.target.value)}
                buttonTarget="#modalProduto"
                buttonText="Cadastrar Produto"
            />

            <Modal
                id="modalProduto"
                title="Cadastrar produto"
            >
                <FormCadastrarProduto onCadastrar={handleProdutoCriado} onErro={handleProdutoErro}/>
            </Modal>

            {loading ? (
                <Spinner/>
            ) : (
                <>
                    {produtosFiltrados.length === 0 ? (
                        <div className="text-center text-muted mt-5 py-5">
                            <i className="bi bi-box fs-1"></i>
                            <p className="mt-2">Nenhum produto encontrado com esse nome.</p>
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
                            {produtosFiltrados.map((produto) => (
                                <div className="col" key={produto.id}>
                                    <Card
                                        icon="box"
                                        title={produto.nome}
                                        buttonEditarTarget={`#modalEditarProduto-${produto.id}`}
                                        buttonExcluirTarget={`#modalExcluirProduto-${produto.id}`}
                                    >
                                        {/* Informações adicionais injetadas via children */}
                                        <p className="mb-1 text-muted text-truncate" title={produto.descricao}>
                                            {produto.descricao || "Nenhuma descrição fornecida."}
                                        </p>
                                        <div
                                            className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-light">
                                            <div>
                                                <span className="d-block small text-muted">Preço</span>
                                                <strong className="text-dark fs-5">
                                                    {new Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL'
                                                    }).format(produto.preco)}
                                                </strong>
                                            </div>
                                            <span
                                                className={`badge ${produto.quantidade <= 5 ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}
                                            >
                                                Qtd: {produto.quantidade}
                                                </span>
                                        </div>
                                        <div className="mt-2 d-flex justify-content-between small text-muted">
                                            <span>{produto.marcaNome || 'Sem Marca'}</span>
                                            <span>{produto.categoriaNome}</span>
                                        </div>
                                    </Card>

                                    <Modal id={`modalEditarProduto-${produto.id}`} title="Editar produto">
                                        <FormEditarProduto
                                            produto={produto}
                                            onSalvar={handleProdutoAtualizado}
                                            onErro={handleProdutoErro}
                                        />
                                    </Modal>

                                    <ModalConfirmacao
                                        id={`modalExcluirProduto-${produto.id}`}
                                        titulo="Você tem certeza"
                                        descricao={
                                            <span>
                                                Você excluirá o produto <strong
                                                className="text-dark">{produto.nome}</strong> e todos os dados associados a ele. Essa ação é irreversível.
                                            </span>
                                        }
                                        onConfirmar={() => handleProdutoExcluido(produto.id)}
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
                onClose={() => setToast({...toast, visivel: false})}
            />
        </DashboardLayout>
    );
}

export default Produtos;