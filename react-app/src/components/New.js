import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MoviesMap from "./MoviesMap";
import Header from "./Header";

const New = () => {
    const [movies, setMovies] = useState([])
    const { jwtToken } = useOutletContext();

    useEffect(() => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        if (jwtToken) {
            headers.append('Authorization', `Bearer ${jwtToken}`);
        }
        const requestOptions = {
            method: 'GET',
            headers: headers,
        };
        fetch(`/latest?count=20`, requestOptions)
            .then(response => response.json())
            .then(data => setMovies(data))
            .catch(error => console.log(error));
    }, [jwtToken]);

    return (
        <>
            <Header />
            <div className="py-6 px-12">
                <h1 className="text-4xl text-white font-bold mb-6">New Releases</h1>
                {movies.length > 0 ? (
                    <MoviesMap movies={movies} />
                ) : (
                    <p className="text-gray-400">No new movies available</p>
                )}
            </div>
        </>
    );
}

export default New;
