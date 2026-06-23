import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { marcaService } from "../../services/marcaService";
import Sidebar from "../../components/ui/sidebar/Sidebar";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Modal from "../../components/ui/Modal";
import Header from "../../components/ui/Header";
import Card from "../../components/ui/Card";
import FormEditarMarca from "./FormEditarMarca";
import FormExcluirMarca from "./FormExcluirMarca";
import FormCadastrarMarca from "./FormCadastrarMarca";

function Marcas() {
    const [marcas, setMarcas] = useState([]);
    const [busca, setBusca] = useState("");

    const [modalAberto, setModalAberto] = useState(false);

    useEffect(() => {
        carregarMarcas();
    }, []);

    const carregarMarcas = async () => {
        try {
            const dados = await marcaService.listarTodos();
            setMarcas(dados || []);
        } catch (error) {
            console.error("Erro ao listar marcas:", error);
        }
    };

    const marcasFiltradas = marcas.filter(m =>
        m.nome.toLowerCase().includes(busca.toLowerCase())
    );

    const handleMarcaCriada = (novaMarca) => {
        setMarcas((marcasAnteriores) => [...marcasAnteriores, novaMarca]);
    };

    const handleMarcaAtualizada = (marcaEditada) => {
        setMarcas((marcasAnteriores) =>
            marcasAnteriores.map((m) => (m.id === marcaEditada.id ? marcaEditada : m))
        );
    };

    const handleMarcaExcluida = async (id) => {
        try {
            await marcaService.excluir(id);
            setMarcas((marcasAnteriores) => marcasAnteriores.filter((m) => m.id !== id));
        } catch (error) {
            console.error("Erro ao excluir marca:", error);
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
                <FormCadastrarMarca onCadastrar={handleMarcaCriada} />
            </Modal>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
                {marcasFiltradas.map((marca) => (
                    <div className="col" key={marca.id}>
                        <Card
                            icon="bookmark-dash"
                            title={marca.nome}
                            buttonEditarTarget={`#modalEditarMarca-${marca.id}`}
                            buttonExcluirTarget={`#modalExcluirMarca-${marca.id}`}
                        />

                        {/* MODAL DE EDIÇÃO */}
                        <Modal id={`modalEditarMarca-${marca.id}`} title="Editar marca">
                            <FormEditarMarca
                                marca={marca}
                                onSalvar={handleMarcaAtualizada}
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

            {marcasFiltradas.length === 0 && (
                <div className="text-center text-muted mt-5 py-5">
                    <i className="bi bi-tag fs-1"></i>
                    <p className="mt-2">Nenhuma marca encontrada com esse nome.</p>
                </div>
            )}
        </DashboardLayout>
    );
}

export default Marcas;
