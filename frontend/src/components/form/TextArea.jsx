function TextArea({margin, label, value, onChange, placeholder, required = false, disabled = false, rows }) {
    return (
        <div className={margin}>
            <label className="mb-1 form-label fw-medium">{label}</label>
            <textarea
                className="form-control border-1 shadow-sm"
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