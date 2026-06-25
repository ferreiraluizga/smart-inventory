function Spinner() {
    return (
        <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Carregando...</span>
            </div>
        </div>
    );
}

export default Spinner;