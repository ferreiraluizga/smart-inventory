import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import Input from "../components/form/Input";
import InputSenha from "../components/form/InputSenha";

function Register() {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [dataNasc, setDataNasc] = useState("");
    const [cpf, setCpf] = useState("");

    const formatarCPF = (valor) => {
        const apenasNumeros = valor.replace(/\D/g, "");

        return apenasNumeros
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    };


    const [visibilidadeSenha, setVisibilidadeSenha] = useState(false);

    const navigate = useNavigate();

    const alterarVisibilidadeSenha = () => {
        setVisibilidadeSenha(antigoValor => !antigoValor);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await authService.register(nome, email, senha, dataNasc, cpf);
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Os dados inseridos estão inválidos");
        }
    }

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                <div className="col-md-6 d-none d-md-flex bg-primary text-white justify-content-center align-items-center">
                    <div className="text-center">
                        <h1 className="display-4 fw-bold">
                            Smart Inventory
                        </h1>

                        <p className="lead">
                            Gerencie seu estoque de forma inteligente.
                        </p>
                    </div>
                </div>

                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div className="card shadow border-0 p-4"
                        style={{ width: "100%", maxWidth: "450px" }}>
                        <div className="card-body">
                            <h2 className="text-center mb-4">Cadastrar</h2>

                            <form onSubmit={handleSubmit}>
                                <Input 
                                    label="Nome Completo"
                                    margin="mb-3"
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />

                                <Input 
                                    label="Data de Nascimento"
                                    margin="mb-3"
                                    type="date"
                                    value={dataNasc}
                                    onChange={(e) => setDataNasc(e.target.value)}
                                    required
                                />

                                <Input 
                                    label="CPF"
                                    margin="mb-3"
                                    type="text"
                                    minLength={14}
                                    maxLength={14}
                                    value={cpf}
                                    onChange={(e) => setCpf(formatarCPF(e.target.value))}
                                    required
                                />

                                <Input 
                                    label="E-mail"
                                    margin="mb-3"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <InputSenha 
                                    margin="mb-4"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </form>

                            <div className="text-center mt-3">
                                <span>Já possui uma conta?</span>
                                <br />
                                <Link to="/login" className="text-decoration-none">
                                    Fazer login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;