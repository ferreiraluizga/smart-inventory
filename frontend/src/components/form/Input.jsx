function Input({label, margin, type, value, onChange, minLength, maxLength, required = false, disabled = false, placeholder}) {
    return (
        <div className={margin}>
            <label className="mb-1 form-label fw-medium">{label}</label>
            <input
                type={type}
                className="form-control border-1 shadow-sm"
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