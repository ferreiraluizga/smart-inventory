import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { marcaService } from "../services/marcaService";
import Sidebar from "../components/ui/sidebar/Sidebar";
import DashboardLayout from "../components/layout/DashboardLayout";

function Marcas() {
    const [marcas, setMarcas] = useState([]);
    const [busca, setBusca] = useState("");

    useEffect(() => {
        carregarMarcas();
    }, []);

    const carregarMarcas = async () => {
        try {
            const dados = await marcaService.listarTodos();
            setMarcas(dados || []);
        } catch (error) {
            console.error("Erro ao listar marcas:", error);
            setMarcas([
                { id: 1, nome: "Nike", totalProdutos: 142 },
                { id: 2, nome: "Adidas", totalProdutos: 89 },
                { id: 3, nome: "Apple", totalProdutos: 34 },
                { id: 4, nome: "Samsung", totalProdutos: 56 }
            ]);
        }
    };

    const marcasFiltradas = marcas.filter(m =>
        m.nome.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <DashboardLayout>


            {/* CABEÇALHO DA PÁGINA */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
                <div>
                    <h1 className="fw-bold h2 m-0 text-dark">Marcas</h1>
                    <p className="text-muted small m-0">Gerencie os fabricantes e fornecedores do estoque.</p>
                </div>

                {/* Barra de Busca + Botão Novo */}
                <div className="d-flex gap-2 align-items-center">
                    <div className="input-group shadow-sm rounded-3" style={{ maxWidth: "300px" }}>
                        <span className="input-group-text bg-white border-end-0 text-muted">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0 ps-0"
                            placeholder="Buscar marca..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>

                    <button className="btn btn-primary shadow-sm px-3 rounded-3 d-flex align-items-center gap-2">
                        <i className="bi bi-plus-lg fw-bold"></i>
                        <span className="d-none d-sm-inline">Nova Marca</span>
                    </button>
                </div>
            </div>

            {/* GRADE DE CARDS MODERNOS */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
                {marcasFiltradas.map((marca) => (
                    <div className="col" key={marca.id}>
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white position-relative card-marca">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="bg-light text-primary rounded-3 d-flex align-items-center justify-content-center"
                                    style={{ width: "45px", height: "45px" }}>
                                    <i className="bi bi-bookmark-dash fs-4"></i>
                                </div>

                                <div className="d-flex gap-1">
                                    <button className="btn btn-link text-muted p-1 hover-text-primary">
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button className="btn btn-link text-muted p-1 hover-text-danger">
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                </div>
                            </div>

                            <h5 className="fw-bold text-dark mb-1">{marca.nome}</h5>
                            <p className="text-muted small mb-0 d-flex align-items-center gap-1">
                                <i className="bi bi-box-seam text-primary"></i>
                                {marca.totalProdutos || 0} produtos no estoque
                            </p>
                        </div>
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
