import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

function PublicRoute({ children }) {
    const authenticated = authService.isAuthenticated();
    return authenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default PublicRoute;
