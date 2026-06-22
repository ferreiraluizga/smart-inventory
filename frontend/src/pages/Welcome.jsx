import { Link } from "react-router-dom";

function Welcome() {
    return (
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">

            <h1 className="mb-4">
                Bem vindo ao Smart Inventory, seu sistema de gerenciamento de estoque inteligente.
            </h1>

            <Link to="/login" className="btn btn-primary">
                Acessar o sistema
            </Link>

        </div>
    );
}

export default Welcome;