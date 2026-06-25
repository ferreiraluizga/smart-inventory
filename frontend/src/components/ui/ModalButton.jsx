function ModalButton({ type, color, disabled, buttonText, fecharModal = false }) {
    return (
        <button
            type={type}
            className={`btn btn-${color} rounded-3 px-4`}
            {...(fecharModal && { "data-bs-dismiss": "modal" })}
            disabled={disabled}
        >
            {buttonText}
        </button>
    );
}

export default ModalButton;