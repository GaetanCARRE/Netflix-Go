import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MoviesMap from "./MoviesMap";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Link } from "react-router-dom";
import Header from "./Header";

const Movies = () => {
    const [movies, setMovies] = useState([])
    const [genres, setGenres] = useState([])
    const [showGenres, setShowGenres] = useState(false)
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
        fetch(`/movies`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const filtered = data.filter(m => m.type === 'movie' || !m.type);
                setMovies(filtered);
            })
            .catch(error => console.log(error));

        fetch(`/genres`, requestOptions)
            .then(res => res.json())
            .then(data => setGenres(data))
            .catch((error) => {
                console.log(error)
            })
    }, [jwtToken]);

    return (
        <>
            <Header />
            <div className="py-6 px-12">
                <h1 className="text-4xl text-white font-bold mb-6">Movies</h1>
                <div className="relative mb-6">
                    <button
                        className="flex items-center gap-2 border border-gray-600 rounded-full px-5 py-2 text-gray-300 hover:bg-gray-800 transition"
                        onClick={() => setShowGenres(!showGenres)}
                    >
                        <span className="text-sm font-medium">Genres</span>
                        {showGenres ? <IoChevronUp /> : <IoChevronDown />}
                    </button>
                    
                    {showGenres && (
                        <div className="absolute top-full mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 bg-stone-900 border border-gray-700 rounded-xl p-4 z-20 min-w-[300px] shadow-xl">
                            {genres.map((g) => (
                                <Link
                                    key={g.id}
                                    to={`/genre/${g.id}`}
                                    state={{
                                        genreName: g.genre,
                                        genres: genres
                                    }}
                                    className="px-3 py-2 text-sm text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition text-center"
                                    onClick={() => setShowGenres(false)}
                                >
                                    {g.genre}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                
                {movies.length > 0 ? (
                    <MoviesMap movies={movies} />
                ) : (
                    <p className="text-gray-400">No movies available</p>
                )}
            </div>
        </>
    );
}

export default Movies;
