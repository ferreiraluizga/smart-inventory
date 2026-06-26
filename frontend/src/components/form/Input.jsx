function Input({label, margin, type, value, onChange, minLength, maxLength, required = false, disabled = false, placeholder, size}) {
    const sizeClass = size === "sm" ? "form-control-sm" : size === "lg" ? "form-control-lg" : "";

    return (
        <div className={margin}>
            <label className="mb-1 form-label fw-medium text-secondary">{label}</label>
            <input
                type={type}
                className={`form-control ${sizeClass} border-1 shadow-sm input-custom-focus`.trim()}
                value={value}
                onChange={onChange}
                minLength={minLength}
                maxLength={maxLength}
                required={required}
                disabled={disabled}
                placeholder={placeholder}
            />
        </div>
    );
}

export default Input;