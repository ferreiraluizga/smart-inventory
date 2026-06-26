function TextArea({margin, label, value, onChange, placeholder, required = false, disabled = false, rows, size }) {
    const sizeClass = size === "sm" ? "form-control-sm" : size === "lg" ? "form-control-lg" : "";
    
    return (
        <div className={margin}>
            <label className="mb-1 form-label fw-medium text-secondary">{label}</label>
            <textarea
                className={`form-control ${sizeClass} border-1 shadow-sm input-custom-focus`.trim()}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                rows={rows}
            />
        </div>
    );
}

export default TextArea;