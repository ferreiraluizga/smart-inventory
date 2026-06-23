import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import SidebarItem from "./SidebarItem";

function Sidebar() {
    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);

    const handleLogout = () => {
        authService.logout();
        navigate("/login");
    };

    return (
        <div className="fixed-bottom w-100 p-3" style={{ zIndex: 1030 }}>

            <div className={`bg-dark shadow-lg rounded-4 p-3 mb-2 d-md-none menu-mobile-retratil ${menuAberto ? 'aberto' : ''}`}>
                <div className="d-flex flex-wrap justify-content-around gap-3 conteudo-menu-mobile">
                    <SidebarItem url="/dashboard" title="Dashboard" icon="grid-1x2" />
                    <SidebarItem url="/dashboard/marcas" title="Marcas" icon="tag" />
                </div>
            </div>

            <div className="bg-dark shadow-lg rounded-4 d-flex flex-row align-items-center p-2"
                style={{ minHeight: "65px" }}>
                <div className="d-flex align-items-center text-white gap-2 px-2" style={{ minWidth: "48px" }}>
                    <div className="bg-primary rounded-3 d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                        style={{ width: "36px", height: "36px", fontSize: "14px", letterSpacing: "0.5px" }}>
                        SI
                    </div>
                </div>

                <div className="d-flex flex-grow-1 justify-content-center">
                    <div className="d-none d-md-flex flex-row align-items-center gap-2">
                        <SidebarItem url="/dashboard" title="Dashboard" icon="grid-1x2" />
                        <SidebarItem url="/dashboard/marcas" title="Marcas" icon="tag" />
                        <SidebarItem url="/dashboard/categorias" title="Categorias" icon="collection" />
                    </div>

                    <button
                        onClick={() => setMenuAberto(!menuAberto)}
                        className={`btn btn-link text-white fs-4 rounded-3 text-decoration-none d-flex align-items-center justify-content-center d-md-none ${menuAberto ? 'bg-white bg-opacity-10' : ''}`}
                        style={{ width: "48px", height: "48px" }}
                        title="Menu"
                    >
                        <i className={`bi bi-${menuAberto ? 'x-lg' : 'list'}`}></i>
                    </button>
                </div>

                <div style={{ minWidth: "48px" }} className="d-flex justify-content-end">
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline-danger border-0 text-white fw-bolder fs-4 rounded-3 text-decoration-none d-flex align-items-center justify-content-center sidebar-logout"
                        style={{ width: "48px", height: "48px" }}
                    >
                        <i className="bi bi-box-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
