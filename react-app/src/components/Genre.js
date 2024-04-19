import { useLocation, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import MoviesMap from "./MoviesMap"
import Header from "./Header"
import { IoChevronForward } from "react-icons/io5";

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
        fetch(`${process.env.REACT_APP_BACKEND}/movies/genres/${id}`, requestOptions)
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
        <>
            <Header />
            <div className="px-12">
                <div
                    className="flex flex-row items-center py-8"
                >
                    <h2 className="text-gray-400">
                        <Link to="/movies" className="text-gray-400">
                            movie
                        </Link>
                    </h2>
                    <IoChevronForward className="text-gray-400" />
                    <h1 className="text-4xl">{genreName} movie</h1>
                </div>
                <MoviesMap movies={movies} />
            </div>
        </>

    )
}

export default Genre