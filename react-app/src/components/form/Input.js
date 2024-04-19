const Input = (props) => {
    return (
        <div className={props.className}>
            <label htmlFor={props.name} className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                {props.title}
            </label>
            <input
                className="w-full text-gray-700 bg-gray-100 py-2 rounded focus:outline-none focus:border-gray-500"
                id={props.name}
                name={props.name}
                type={props.type}
                value={props.value}
                onChange={props.onChange}
                placeholder={props.placeholder}
            />
            <div className={props.errorDiv}>{props.errorMessage}</div>
        </div>
    )
}

export default Input;