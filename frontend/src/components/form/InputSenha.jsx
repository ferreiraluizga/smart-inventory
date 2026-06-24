import { useState } from "react";

function InputSenha({ margin, value, onChange}) {
    
    const [visibilidadeSenha, setVisibilidadeSenha] = useState(false);

    const alterarVisibilidadeSenha = () => {
        setVisibilidadeSenha(antigoValor => !antigoValor);
    }
    
    return (
        <div className={margin}>
            <label>Senha</label>
            <div className="input-group mb-3">
                <input
                    type={visibilidadeSenha ? "text" : "password"}
                    className="form-control border-1 shadow-sm input-custom-focus"
                    value={value}
                    onChange={onChange}
                    required
                />
                <button
                    type="button"
                    className="btn btn-outline-warning"
                    onClick={alterarVisibilidadeSenha}
                >
                    <i className={`bi ${visibilidadeSenha ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
            </div>
        </div>
    );
}

export default InputSenha;