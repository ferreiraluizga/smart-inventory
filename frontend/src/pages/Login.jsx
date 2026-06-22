import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import AuthBanner from "../components/auth/AuthBanner";
import Input from "../components/form/Input";
import InputSenha from "../components/form/InputSenha";
import Alert from "../components/ui/Alert";

function Login() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [erro, setErro] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await authService.login(email, senha);
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            setErro("E-mail ou senha inválidos. Tente novamente.");
        }
    };

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                <AuthBanner />
                
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div className="card shadow border-0 p-4"
                        style={{ width: "100%", maxWidth: "450px" }}>
                        <div className="card-body">
                            <h2 className="text-center mb-4">Entrar</h2>

                            <form onSubmit={handleSubmit}>
                                <Alert mensagem={erro} />

                                <Input 
                                    label="Email"
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

                                <button type="submit" className="btn btn-primary w-100">Entrar</button>
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