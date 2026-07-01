import { useNavigate } from "react-router-dom";

// ADICIONADO: 'mostrarPesquisa = true' como valor padrão nas propriedades
function Header({ titulo, descricao, searchPlaceholder, searchValue, searchOnChange, buttonTarget, buttonText, buttonLink, mostrarPesquisa = true }) {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        if (buttonLink) {
            navigate(buttonLink);
        }
    }

    return (
        <div className="card shadow-sm border-0 p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5">
            <div>
                <h1 className="fw-bold h2 m-0 text-dark">{titulo}</h1>
                <p className="text-muted small m-0">{descricao}</p>
            </div>

            {/* ALTERADO: A barra de pesquisa agora só renderiza se 'mostrarPesquisa' for verdadeiro */}
            {mostrarPesquisa && (
                <div className="w-100">
                    <div className="input-group rounded-3">
                        <span className="input-group-text bg-white border-1 shadow-sm border-end-0 text-muted shadow-sm">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-1 shadow-sm border-start-0 input-custom-focus"
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={searchOnChange}
                        />
                    </div>
                </div>
            )}

            <div>
                <button
                    className="btn btn-warning shadow-sm px-3 rounded-3 d-flex align-items-center gap-2 text-nowrap"
                    data-bs-toggle={buttonTarget ? "modal" : undefined}
                    data-bs-target={buttonTarget ? buttonTarget : undefined}
                    onClick={handleButtonClick}
                >
                    <i className="bi bi-plus-circle fw-bold"></i>
                    <span className="d-inline">{buttonText}</span>
                </button>
            </div>
        </div>
    );
}

export default Header;