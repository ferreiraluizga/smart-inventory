function Select({ margin, label, required = false, disabled = false, onChange, value, placeholder, options, size }) {
    const sizeClass = size === "sm" ? "form-select-sm" : size === "lg" ? "form-select-lg" : "";

    return (
        <div className={margin}>
            <label className="mb-1 form-label fw-medium text-secondary">{label}</label>
            <select
                className={`form-select ${sizeClass} border-1 shadow-sm input-custom-focus`.trim()}
                required={required}
                disabled={disabled}
                onChange={onChange}
                value={value}
            >
                <option disabled value="">{placeholder}</option>
                {options.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.nome}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Select;