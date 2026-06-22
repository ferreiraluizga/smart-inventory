import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";

function Login() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await authService.login(email, senha);
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Email ou senha inválidos");
        }
    };

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

                            <h2 className="text-center mb-4">
                                Entrar
                            </h2>

                            <form onSubmit={handleSubmit}>

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
                                    Entrar
                                </button>

                            </form>

                            <div className="text-center mt-3">

                                <span>Não possui conta?</span>

                                <br />

                                <Link to="/register" className="text-decoration-none">
                                    Cadastre-se
                                </Link>

                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Login;