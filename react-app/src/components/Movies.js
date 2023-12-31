import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Movies = () => {
    const [movies, setMovies] = useState([])

    useEffect(() => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const requestOptions = {
            method: 'GET',
            headers: headers,
        };
        fetch(`http://localhost:8080/movies`, requestOptions)
        .then(response => response.json())
        .then(data => setMovies(data))
        .catch(error => console.log(error));
    }, []);

    return (
        <div>
            <h1>Movies</h1>


            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                title
                            </th>
                            <th scope="col" className="px-6 py-3">
                                director
                            </th>
                            <th scope="col" className="px-6 py-3">
                                runtime
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                        {movies.map((movie) => (
                            <tr key={movie.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/movies/${movie.id}`}>{movie.title}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{movie.director}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{movie.runtime}</td>
                            </tr>))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Movies;