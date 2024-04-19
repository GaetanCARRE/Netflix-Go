const CheckBox = (props) => {
    return (
        <div className={props.className}>
            <label htmlFor={`${props.name}-${props.title}`} className="inline-flex items-center bg-stone-800 p-2 rounded-xl m-1">
                <input
                    id={`${props.name}-${props.title}`}
                    type="checkbox"
                    defaultValue={props.value}
                    name={props.name}
                    onChange={props.onChange}
                    checked={props.checked}
                    className="mr-2"
                />
                <span className="text-sm text-gray-200">
                    {props.title}
                </span>
            </label>
        </div>
    )
}

export default CheckBox;