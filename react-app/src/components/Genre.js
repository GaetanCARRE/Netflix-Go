import { useLocation, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
const Genre = () => {

    const location = useLocation();
    const genreName = location.state.genreName;

    const [movies, setMovies] = useState([])

    let { id } = useParams()
    useEffect(() => {

        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        const requestOptions = {
            method: 'GET',
            headers: headers,
        }
        fetch(`/movies/genres/${id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log("data", data)
                if (data.error) {
                    console.log(data.message);
                    return
                }
                else {
                    setMovies(data);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [id])

    return (
        <div>
            <h1>{genreName}</h1>
            <hr />
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
    )
}

export default Genre