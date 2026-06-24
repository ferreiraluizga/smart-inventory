function ModalButton({ type, color, disabled, buttonText }) {
    return (
        <button
            type={type}
            className={`btn btn-${color} rounded-3 px-4`}
            data-bs-dismiss="modal"
            disabled={disabled}
        >
            {buttonText}
        </button>
    );
}

export default ModalButton;