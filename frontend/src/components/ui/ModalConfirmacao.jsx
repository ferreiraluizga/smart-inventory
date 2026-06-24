function ModalConfirmacao({ id, titulo, descricao, onConfirmar, tipo}) {

    const configVisual = {
        danger: { icone: "bi-exclamation-triangle", bg: "bg-danger-subtle", text: "text-danger", btn: "btn-danger" },
        warning: { icone: "bi-exclamation-circle", bg: "bg-warning-subtle", text: "text-warning", btn: "btn-warning" },
        success: { icone: "bi-check-circle", bg: "bg-success-subtle", text: "text-success", btn: "btn-success" },
        primary: { icone: "bi-info-circle", bg: "bg-primary-subtle", text: "text-primary", btn: "btn-primary" }
    };

    const estilo = configVisual[tipo] || configVisual.danger;

    return (
        <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-body text-center p-4">
                        <div className={`mx-auto mb-3 ${estilo.text} ${estilo.bg} rounded-circle d-flex align-items-center justify-content-center`} 
                             style={{ width: "60px", height: "60px" }}>
                            <i className={`bi ${estilo.icone} fs-3`}></i>
                        </div>

                        <h5 className="fw-bold text-dark mb-2">{titulo}</h5>
                        
                        <div className="text-muted fs-6 mb-4">
                            {descricao}
                        </div>

                        <div className="d-flex justify-content-center gap-2">
                            <button
                                type="button"
                                className="btn btn-light rounded-3 px-4 fw-medium text-secondary"
                                data-bs-dismiss="modal"
                            >
                                Não
                            </button>

                            <button
                                type="button"
                                className={`btn rounded-3 px-4 fw-medium ${estilo.btn}`}
                                data-bs-dismiss="modal"
                                onClick={onConfirmar}
                            >
                                Sim
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalConfirmacao;
