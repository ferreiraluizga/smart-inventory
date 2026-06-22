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
                    className="form-control"
                    value={value}
                    onChange={onChange}
                    required
                />
                <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={alterarVisibilidadeSenha}
                >
                    <i className={`bi ${visibilidadeSenha ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
            </div>
        </div>
    );
}

export default InputSenha;