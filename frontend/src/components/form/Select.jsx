function Select({ margin, label, required = false, disabled = false, onChange, value, placeholder, options }) {
    return (
        <div className={margin}>
            <label className="form-label">{label}</label>
            <select
                className="form-control border-1 shadow-sm input-custom-focus"
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