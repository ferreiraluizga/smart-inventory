import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

function PrivateRoute({children}) {
    const authenticated = authService.isAuthenticated();
    return authenticated ? children : <Navigate to={"/login"} replace />;
}

export default PrivateRoute;