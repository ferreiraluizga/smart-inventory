import { useEffect, useState } from "react"
import { produtoService } from "../../services/produtoService";
import { fornecedorService } from "../../services/fornecedorService";
import { categoriaService } from "../../services/categoriaService";
import { marcaService } from "../../services/marcaService";
import Select from "../../components/form/Select";
import Input from "../../components/form/Input";
import ModalButton from "../../components/ui/ModalButton";
import TextArea from "../../components/form/TextArea";

function FormCadastrarProduto({ onCadastrar, onErro }) {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [preco, setPreco] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [fornecedorId, setFornecedorId] = useState("");
    const [categoriaId, setCategoriaId] = useState("");
    const [marcaId, setMarcaId] = useState("");

    const [fornecedores, setFornecedores] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        const carregarDadosAuxiliares = async () => {
            try {
                const [dadosFornecedores, dadosCategorias, dadosMarcas] = await Promise.all([
                    fornecedorService.listarTodos(),
                    categoriaService.listarTodos(),
                    marcaService.listarTodos()
                ]);

                setFornecedores(dadosFornecedores || []);
                setCategorias(dadosCategorias || []);
                setMarcas(dadosMarcas || []);
            } catch (error) {
                console.error("Erro ao carregar dados para o formulário de produtos:", error);
                if (onErro) {
                    onErro("Erro ao carregar listas de fornecedores, categorias ou marcas.");
                }
            }
        }

        carregarDadosAuxiliares();
    }, [onErro]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);

        try {
            const novoProduto = await produtoService.salvar(nome, descricao, preco, quantidade, true, fornecedorId, categoriaId, marcaId);

            if (onCadastrar) {
                onCadastrar(novoProduto);
            }

            setNome("");
            setDescricao("");
            setPreco("");
            setQuantidade("");
            setFornecedorId("");
            setCategoriaId("");
            setMarcaId("");
        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);

            if (onErro) {
                const mensagemServidor =
                    error.response?.data?.message ||
                    error.message ||
                    "Não foi possível cadastrar o produto. Tente novamente.";

                onErro(mensagemServidor);
            }
        } finally {
            setCarregando(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Nome"
                margin="mb-3"
                placeholder="Digite o nome do produto"
                type="text"
                required
                disabled={carregando}
                onChange={(e) => setNome(e.target.value)}
                value={nome}
            />

            <TextArea
                label="Descrição"
                margin="mb-3"
                placeholder="Digite a descrição do produto"
                required
                disabled={carregando}
                onChange={(e) => setDescricao(e.target.value)}
                value={descricao}
                rows={3}
            />

            <div className="row">
                <div className="col-6">
                    <Input
                        label="Preço"
                        margin="mb-3"
                        placeholder="0.00"
                        type="number"
                        required
                        disabled={carregando}
                        onChange={(e) => setPreco(e.target.value)}
                        value={preco}
                    />
                </div>

                <div className="col-6">
                    <Input
                        label="Quantidade"
                        margin="mb-3"
                        placeholder="Quantidade em estoque"
                        type="number"
                        required
                        disabled={carregando}
                        onChange={(e) => setQuantidade(e.target.value)}
                        value={quantidade}
                    />
                </div>
            </div>

            <Select
                label="Fornecedor"
                margin="mb-3"
                placeholder="Selecione um fornecedor"
                options={fornecedores}
                value={fornecedorId}
                disabled={carregando}
                required
                onChange={(e) => setFornecedorId(e.target.value)}
            />

            <div className="row">
                <div className="col-6">
                    <Select
                        label="Categoria"
                        margin="mb-3"
                        placeholder="Selecione uma categoria"
                        options={categorias}
                        value={categoriaId}
                        disabled={carregando}
                        required
                        onChange={(e) => setCategoriaId(e.target.value)}
                    />
                </div>
                
                <div className="col-6">
                    <Select
                        label="Marca"
                        margin="mb-3"
                        placeholder="Selecione uma marca"
                        options={marcas}
                        value={marcaId}
                        disabled={carregando}
                        required
                        onChange={(e) => setMarcaId(e.target.value)}
                    />
                </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
                <ModalButton
                    type="button"
                    color="light"
                    disabled={carregando}
                    buttonText="Cancelar"
                    fecharModal
                />

                <ModalButton
                    type="submit"
                    color="warning"
                    disabled={carregando}
                    buttonText={carregando ? "Cadastrando..." : "Cadastrar Produto"}
                />
            </div>
        </form>
    );
}

export default FormCadastrarProduto;