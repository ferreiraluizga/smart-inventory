function FormExcluirCategoria({ categoria, onExcluir }) {
    if (!categoria) return null;

    const handleConfirmar = () => {
        if (onExcluir) {
            onExcluir(categoria.id);
        }
    };

    return (
        <div className="text-center p-2">
            <div className="mx-auto mb-3 text-danger bg-danger-subtle rounded-circle d-flex align-items-center justify-content-center" 
                 style={{ width: "60px", height: "60px" }}>
                <i className="bi bi-exclamation-triangle fs-3"></i>
            </div>

            <h5 className="fw-bold text-dark mb-2">Você tem certeza?</h5>
            <p className="text-muted fs-6 mb-4">
                Esta ação não poderá ser desfeita. A categoria <strong className="text-dark">"{categoria.nome}"</strong> será excluída permanentemente do sistema.
            </p>

            <div className="d-flex justify-content-center gap-2">
                <button
                    type="button"
                    className="btn btn-light rounded-3 px-4 fw-medium text-secondary"
                    data-bs-dismiss="modal"
                >
                    Não, cancelar
                </button>
                <button
                    type="button"
                    className="btn btn-danger rounded-3 px-4 fw-medium"
                    data-bs-dismiss="modal"
                    onClick={handleConfirmar}
                >
                    Sim, excluir
                </button>
            </div>
        </div>
    );
}

export default FormExcluirCategoria;
