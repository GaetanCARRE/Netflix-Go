import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    return (
        <div>
            <h1 className="text-2xl">Oops! Something went wrong.</h1>
            <p className="text-xl">{error.statusText || error.message}</p>
        </div>
    );  
}