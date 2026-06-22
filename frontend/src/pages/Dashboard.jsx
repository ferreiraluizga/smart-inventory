import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

function Dashboard() {

    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate("/login");
    };

    return(
        <div className="container mt-5">
            <h1>Dashboard</h1>
            <p>Usuário Autenticado.</p>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
    );
}

export default Dashboard;