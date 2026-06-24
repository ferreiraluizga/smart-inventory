import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { marcaService } from "../../services/marcaService";
import Sidebar from "../../components/ui/sidebar/Sidebar";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Modal from "../../components/ui/Modal";
import Header from "../../components/ui/Header";
import Card from "../../components/ui/Card";
import Toast from "../../components/ui/Toast";
import FormEditarMarca from "./FormEditarMarca";
import FormExcluirMarca from "./FormExcluirMarca";
import FormCadastrarMarca from "./FormCadastrarMarca";

function Marcas() {
    const [marcas, setMarcas] = useState([]);
    const [busca, setBusca] = useState("");

    const [toast, setToast] = useState({ visivel: false, mensagem: "", tipo: "danger" });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarMarcas();
    }, []);

    const mostrarToast = (mensagem, tipo = "danger") => {
        setToast({ visivel: true, mensagem, tipo });
        setTimeout(() => {
            setToast({ visivel: false, mensagem: "", tipo: "danger" });
        }, 4000);
    };

    const carregarMarcas = async () => {
        try {
            setLoading(true);
            const dados = await marcaService.listarTodos();
            setMarcas(dados || []);
        } catch (error) {
            console.error("Erro ao listar marcas:", error);
            mostrarToast("Erro ao carregar a lista de marcas do servidor.");
        } finally {
            setLoading(false);
        }
    };

    const marcasFiltradas = marcas.filter(m =>
        m.nome.toLowerCase().includes(busca.toLowerCase())
    );

    const handleMarcaCriada = (novaMarca) => {
        setMarcas((marcasAnteriores) => [...marcasAnteriores, novaMarca]);
        mostrarToast("Marca cadastrada com sucesso!", "success");
    };

    const handleMarcaErro = (mensagemErro) => {
        mostrarToast(mensagemErro, "danger");
    };

    const handleMarcaAtualizada = (marcaEditada) => {
        setMarcas((marcasAnteriores) =>
            marcasAnteriores.map((m) => (m.id === marcaEditada.id ? marcaEditada : m))
        );
        mostrarToast("Marca atualizada com sucesso!", "success");
    };

    const handleMarcaExcluida = async (id) => {
        try {
            await marcaService.excluir(id);
            setMarcas((marcasAnteriores) => marcasAnteriores.filter((m) => m.id !== id));
            mostrarToast("Marca excluída com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao excluir marca:", error);
            mostrarToast("Não foi possível excluir a marca. Vinculada a produtos?");
        }
    };

    return (
        <DashboardLayout>
            <Header
                titulo="Marcas"
                descricao="Gerencie os fabricantes e fornecedores do estoque."
                searchPlaceholder="Buscar marca..."
                searchValue={busca}
                searchOnChange={(e) => setBusca(e.target.value)}
                buttonTarget="#modalMarca"
                buttonText="Cadastrar Marca"
            />

            <Modal
                id={"modalMarca"}
                title={"Cadastrar marca"}
            >
                <FormCadastrarMarca onCadastrar={handleMarcaCriada} onErro={handleMarcaErro} />
            </Modal>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
                    {marcasFiltradas.map((marca) => (
                        <div className="col" key={marca.id}>
                            <Card
                                icon="bookmark-dash"
                                title={marca.nome}
                                buttonEditarTarget={`#modalEditarMarca-${marca.id}`}
                                buttonExcluirTarget={`#modalExcluirMarca-${marca.id}`}
                            />

                            <Modal id={`modalEditarMarca-${marca.id}`} title="Editar marca">
                                <FormEditarMarca
                                    marca={marca}
                                    onSalvar={handleMarcaAtualizada}
                                    onErro={handleMarcaErro}
                                />
                            </Modal>

                            <Modal
                                id={`modalExcluirMarca-${marca.id}`}
                                title="Excluir marca"
                            >
                                <FormExcluirMarca
                                    marca={marca}
                                    onExcluir={handleMarcaExcluida}
                                />
                            </Modal>
                        </div>
                    ))}
                </div>
            )}

            {marcasFiltradas.length === 0 && (
                <div className="text-center text-muted mt-5 py-5">
                    <i className="bi bi-tag fs-1"></i>
                    <p className="mt-2">Nenhuma marca encontrada com esse nome.</p>
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

export default Marcas;
