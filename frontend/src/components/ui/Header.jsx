function Header({ titulo, descricao, searchPlaceholder, searchValue, searchOnChange, buttonTarget, buttonText }) {
    return (
        <div className="card shadow-sm border-0 p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5">
            <div>
                <h1 className="fw-bold h2 m-0 text-dark">{titulo}</h1>
                <p className="text-muted small m-0">{descricao}</p>
            </div>

            <div className="w-100">
                <div className="input-group shadow-sm rounded-3">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                        <i className="bi bi-search"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={searchOnChange}
                    />
                </div>
            </div>

            <div>
                <button
                    className="btn btn-primary shadow-sm px-3 rounded-3 d-flex align-items-center gap-2 text-nowrap"
                    data-bs-toggle="modal"
                    data-bs-target={buttonTarget}
                >
                    <i className="bi bi-plus-lg fw-bold"></i>
                    <span className="d-inline">{buttonText}</span>
                </button>
            </div>
        </div>
    );
}

export default Header;