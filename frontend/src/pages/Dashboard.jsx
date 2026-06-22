import DashboardLayout from "../components/layout/DashboardLayout";
import { authService } from "../services/authService";

function Dashboard() {
    return(
        <DashboardLayout>
            <h1>Dashboard</h1>
            <p>Usuário Autenticado.</p>
        </DashboardLayout>
    );
}

export default Dashboard;