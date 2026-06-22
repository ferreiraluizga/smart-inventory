function Alert({mensagem}) {
    if (!mensagem) return null;

    return (
        <div className="alert alert-danger d-flex align-items-center mb-3 py-2 px-3 small border-0 shadow-sm animate__animated animate__fadeIn" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{mensagem}</div>
        </div>
    );
}

export default Alert;