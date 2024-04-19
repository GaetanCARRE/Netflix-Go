import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
const Genres = () => {

    const [genres, setGenres] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {

        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        const requestOptions = {
            method: 'GET',
            headers: headers,
        }
        fetch(`${process.env.REACT_APP_BACKEND}/genres`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.message)
                    return
                }
                else {
                    setGenres(data)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    if (error !== null) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error.message}</p>
            </div>
        )
    }
    else {
        return (
            <div>
                <h1>Genres</h1>
                <hr />
                <div className="">
                    {genres.map((g) => (
                        <Link
                            key={g.id}
                            to={`/genre/${g.id}`}
                            state={
                                {
                                    genreName: g.genre
                                }
                            }
                        >
                            {g.genre}
                        </Link>
                    ))}
                    </div>
                </div>
        )
    }
}

export default Genres