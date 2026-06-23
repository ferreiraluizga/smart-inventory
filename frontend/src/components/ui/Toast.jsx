import { useEffect, useState } from "react";

function Toast({ mensagem, tipo = "danger", visivel, onClose }) {
    const [animar, setAnimar] = useState(false);

    useEffect(() => {
        if (visivel) {
            const tempoEntrada = setTimeout(() => setAnimar(true), 50);
            const tempoSaida = setTimeout(() => {
                fecharComSuavidade();
            }, 4000);

            return () => {
                clearTimeout(tempoEntrada);
                clearTimeout(tempoSaida);
            };
        } else {
            setAnimar(false);
        }
    }, [visivel]);

    const fecharComSuavidade = () => {
        setAnimar(false);
        setTimeout(() => {
            onClose();
        }, 150);
    };

    if (!visivel) return null;

    const ehSucesso = tipo === "success";
    const icone = ehSucesso ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill";
    const corTextoIcone = ehSucesso ? "text-success" : "text-danger";

    return (
        <div
            className="toast-container position-fixed bottom-0 end-0 p-3"
            style={{ zIndex: 1055 }}
        >
            <div
                className={`toast ${animar ? "fade show" : "fade"} shadow-lg rounded-3 text-bg-dark border-0`}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                style={{ display: "block" }}
            >
                <div
                    className="toast-header border-bottom-0 pt-2 px-3 text-bg-dark"
                    style={{ borderTopLeftRadius: "calc(0.5rem - 1px)", borderTopRightRadius: "calc(0.5rem - 1px)" }}
                >
                    <i className={`bi ${icone} ${corTextoIcone} fs-5 me-2`}></i>
                    <strong className="me-auto text-white">Smart Inventory</strong>
                    <small className="text-white-50">agora</small>
                    <button
                        type="button"
                        className="btn-close btn-close-white ms-2"
                        aria-label="Fechar"
                        onClick={fecharComSuavidade}
                    ></button>
                </div>

                <div className="toast-body text-white-50 pb-3 px-3 fs-6">
                    {mensagem}
                </div>
            </div>
        </div>
    );
}

export default Toast;