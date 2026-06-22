import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SidebarItem({ url, title, icon }) {
    const location = useLocation();
    const navigate = useNavigate();
    
    const linkRef = useRef(null); 
    const tooltipInstanceRef = useRef(null); 

    useEffect(() => {
        let elemento = linkRef.current;

        import("bootstrap").then((bootstrap) => {
            if (elemento) {
                if (tooltipInstanceRef.current) {
                    tooltipInstanceRef.current.dispose();
                }
                tooltipInstanceRef.current = new bootstrap.Tooltip(elemento, {
                    trigger: "hover"
                });
            }
        });

        return () => {
            if (tooltipInstanceRef.current) {
                tooltipInstanceRef.current.dispose();
            }
        };
    }, [location.pathname]);

    const handleNavegacao = (e) => {
        e.preventDefault();

        if (tooltipInstanceRef.current) {
            tooltipInstanceRef.current.hide(); 
        }

        navigate(url);
    };

    const verificarAtivo = (caminho) => {
        return location.pathname === caminho 
            ? "text-white bg-white bg-opacity-10 shadow-sm" 
            : "text-white-50 opacity-75";
    };

    return (
        <button
            ref={linkRef}
            onClick={handleNavegacao}
            className={`btn btn-link fs-4 rounded-3 text-decoration-none d-flex align-items-center justify-content-center sidebar-link ${verificarAtivo(url)}`}
            style={{ width: "48px", height: "48px", padding: 0 }}
            title={title}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
        >
            <i className={`bi bi-${icon}`}></i>
        </button>
    );
}

export default SidebarItem;
