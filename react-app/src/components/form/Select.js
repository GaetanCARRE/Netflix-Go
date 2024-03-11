const Select = (props) => {
    return (
        <div className={props.className}>
            <label htmlFor={props.name} className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                {props.title}
            </label>
            <select className=""
            name={props.name}
            id={props.name}
            value={props.value}
            onChange={props.onChange}
            >
                <option value="" disabled>{props.placeholder}</option>
                {props.options.map(option => {
                    return (
                        <option
                            key={option}
                            value={option}
                        >
                                {option.value}
                        </option>
                    );
                })}

            </select>
            <div className={props.errorDiv}>{props.errorMessage}</div>
        </div>
    )
}

export default Select;