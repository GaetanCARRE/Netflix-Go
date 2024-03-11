import { useEffect, useState } from "react";
import MoviesMap from "./MoviesMap";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Link } from "react-router-dom";
import Header from "./Header";

const Movies = () => {
    const [movies, setMovies] = useState([])
    const [genres, setGenres] = useState([])
    const [showGenres, setShowGenres] = useState(false)

    useEffect(() => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const requestOptions = {
            method: 'GET',
            headers: headers,
        };
        fetch(`/movies`, requestOptions)
            .then(response => response.json())
            .then(data => setMovies(data))
            .catch(error => console.log(error));

        fetch(`/genres`, requestOptions)
            .then(res => res.json())
            .then(data => setGenres(data))
            .catch((error) => {
                console.log(error)
            })
    }, []);
    console.log(movies);



    return (
        <>
            <Header />

            <div className="py-6 px-12">
                {/* <h1 className="text-4xl px-12">Movies</h1> */}
                <div
                    className="flex items-center border solid mt-5 text-2xl gap-6 w-min rounded p-2"
                    onClick={() => setShowGenres(!showGenres)}
                >
                    <div>Genres</div>
                    <div>
                        {showGenres ? <IoChevronUp /> : <IoChevronDown />}

                    </div>

                </div>
                {showGenres && (
                    <div className="absolute grid grid-cols-4 border border-gray-600 rounded p-2 w-1/3 bg-black bg-opacity-90 z-10">
                        {genres.map((g) => (
                            <Link
                                key={g.id}
                                to={`/genre/${g.id}`}
                                state={
                                    {
                                        genreName: g.genre,
                                        genres: genres
                                    }
                                }
                            >
                                {g.genre}
                            </Link>
                        ))}
                    </div>
                )}
                <MoviesMap movies={movies} />

            </div>
        </>
    );

}

export default Movies;

