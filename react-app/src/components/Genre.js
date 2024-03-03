import { useLocation, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import MoviesMap from "./MoviesMap"
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
            <MoviesMap movies={movies} />
        </div>
    )
}

export default Genre