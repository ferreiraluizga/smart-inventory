import { useNavigate } from "react-router-dom";

function Card({ icon, title, buttonEditarTarget, buttonExcluirTarget, children, onClick }) {
    const navigate = useNavigate();

    return (
        <div className="card h-100 border-0 shadow-sm rounded-4 p-4 bg-white position-relative overflow-hidden custom-card-hover"
             onClick={onClick}
             style={{
                 transition: "all 0.25s ease-in-out",
                 cursor: onClick ? "pointer" : "default"
             }}
        >
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="bg-warning-subtle text-warning rounded-4 d-flex align-items-center justify-content-center"
                     style={{ width: "48px", height: "48px" }}>
                    <i className={`bi bi-${icon} fs-4`}></i>
                </div>

                <div className="d-flex gap-2 action-buttons" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="btn btn-light text-secondary p-2 rounded-3 border-0 d-flex align-items-center justify-content-center"
                        style={{ width: "36px", height: "36px" }}
                        title="Editar"
                        data-bs-toggle="modal"
                        data-bs-target={buttonEditarTarget}
                    >
                        <i className="bi bi-pencil fs-5"></i>
                    </button>

                    <button
                        className="btn btn-light text-secondary p-2 rounded-3 border-0 d-flex align-items-center justify-content-center"
                        style={{ width: "36px", height: "36px" }}
                        title="Excluir"
                        data-bs-toggle="modal"
                        data-bs-target={buttonExcluirTarget}
                    >
                        <i className="bi bi-trash3 fs-5"></i>
                    </button>
                </div>
            </div>

            <h5 className="fw-bold text-dark mb-2 opacity-90">{title}</h5>

            <div>
                {children}
            </div>
        </div>
    );
}

export default Card;
