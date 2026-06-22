import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

function Register() {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [dataNasc, setDataNasc] = useState("");
    const [cpf, setCpf] = useState("");

    const navigate = useNavigate();

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

    return(
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

                            <h2 className="text-center mb-4">
                                Cadastrar
                            </h2>

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">
                                    <label>Nome Completo</label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Data de Nascimento</label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        value={dataNasc}
                                        onChange={(e) => setDataNasc(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>CPF</label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={cpf}
                                        onChange={(e) => setCpf(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Email</label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label>Senha</label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                >
                                    Cadastrar
                                </button>

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