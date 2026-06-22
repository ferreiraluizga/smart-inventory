function Input({label, margin, type, value, onChange, minLength, maxLength, required = false}) {
    return (
        <div className={margin}>
            <label>{label}</label>
            <input
                type={type}
                className="form-control"
                value={value}
                onChange={onChange}
                minLength={minLength}
                maxLength={maxLength}
                required={required}
            />
        </div>
    );
}

export default Input;