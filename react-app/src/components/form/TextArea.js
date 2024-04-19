const TextArea = (props) => {
    return (
        <div className={props.className}>
            <label htmlFor={props.name} className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                {props.title}
            </label>
            <textarea
                className="text-black w-full h-28 p-1 focus:outline-none focus:border-gray-500 rounded bg-gray-100"
                id={props.name}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                rows={props.rows}
            />

            <div className={props.errorDiv}>{props.errorMessage}</div>
        </div>
    )
}

export default TextArea;