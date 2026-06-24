import { useEffect, useState } from "react";
import { categoriaService } from "../../services/categoriaService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Header from "../../components/ui/Header";
import Modal from "../../components/ui/Modal";
import FormCadastrarCategoria from "./FormCadastrarCategoria";
import FormEditarCategoria from "./FormEditarCategoria";
import FormExcluirCategoria from "./FormExcluirCategoria";
import Card from "../../components/ui/Card";
import Toast from "../../components/ui/Toast";

function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [busca, setBusca] = useState("");

    const [toast, setToast] = useState({ visivel: false, mensagem: "", tipo: "danger" });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarCategorias();
    }, []);

    const mostrarToast = (mensagem, tipo = "danger") => {
        setToast({ visivel: true, mensagem, tipo });
    };

    const carregarCategorias = async () => {
        try {
            setLoading(true);
            const dados = await categoriaService.listarTodos();
            setCategorias(dados || []);
        } catch (error) {
            console.error("Erro ao listar categorias: ", error);
            mostrarToast("Erro ao carregar a lista de categorias.");
        } finally {
            setLoading(false);
        }
    }

    const categoriasFiltradas = categorias.filter(c =>
        c.nome.toLowerCase().includes(busca.toLowerCase())
    );

    const handleCategoriaCriada = (novaCategoria) => {
        setCategorias((categoriasAnteriores) => [...categoriasAnteriores, novaCategoria]);
        mostrarToast("Categoria cadastrada com sucesso!", "success");
    }

    const handleCategoriaErro = (mensagemErro) => {
        mostrarToast(mensagemErro, "danger");
    };

    const handleCategoriaAtualizada = (categoriaEditada) => {
        setCategorias((categoriasAnteriores) =>
            categoriasAnteriores.map((c) => (c.id === categoriaEditada.id ? categoriaEditada : c))
        );
        mostrarToast("Categoria atualizada com sucesso!", "success");
    };

    const handleCategoriaExcluida = async (id) => {
        try {
            await categoriaService.excluir(id);
            setCategorias((categoriasAnteriores) => categoriasAnteriores.filter((c) => c.id !== id));
            mostrarToast("Categoria excluída com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao excluir categoria:", error);
            mostrarToast("Não foi possível excluir a categoria. Vinculada a produtos?");
        }
    };

    return (
        <DashboardLayout>
            <Header
                titulo="Categorias"
                descricao="Gerencie as categorias dos produtos do estoque."
                searchPlaceholder="Buscar categoria..."
                searchValue={busca}
                searchOnChange={(e) => setBusca(e.target.value)}
                buttonTarget="#modalCategoria"
                buttonText="Cadastrar Categoria"
            />

            <Modal
                id={"modalCategoria"}
                title={"Cadastrar categoria"}
            >
                <FormCadastrarCategoria onCadastrar={handleCategoriaCriada} onErro={handleCategoriaErro} />
            </Modal>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
                    {categoriasFiltradas.map((categoria) => (
                        <div className="col" key={categoria.id}>
                            <Card
                                icon="bookmark-dash"
                                title={categoria.nome}
                                buttonEditarTarget={`#modalEditarCategoria-${categoria.id}`}
                                buttonExcluirTarget={`#modalExcluirCategoria-${categoria.id}`}
                            >
                                <p>{categoria.descricao}</p>
                            </Card>

                            <Modal id={`modalEditarCategoria-${categoria.id}`} title="Editar categoria">
                                <FormEditarCategoria
                                    categoria={categoria}
                                    onSalvar={handleCategoriaAtualizada}
                                    onErro={handleCategoriaErro}
                                />
                            </Modal>

                            <Modal
                                id={`modalExcluirCategoria-${categoria.id}`}
                                title="Excluir categoria"
                            >
                                <FormExcluirCategoria
                                    categoria={categoria}
                                    onExcluir={handleCategoriaExcluida}
                                />
                            </Modal>
                        </div>
                    ))}
                </div>
            )}

            {categoriasFiltradas.length === 0 && (
                <div className="text-center text-muted mt-5 py-5">
                    <i className="bi bi-tag fs-1"></i>
                    <p className="mt-2">Nenhuma categoria encontrada com esse nome.</p>
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

export default Categorias;