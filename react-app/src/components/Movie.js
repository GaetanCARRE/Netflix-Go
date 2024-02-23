import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Movie = () => {
    const [movie, setMovie] = useState({});
    let { id } = useParams();

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers,
        };

        fetch(`/movies/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => setMovie(data))
            .catch((error) => console.log(error));
    }, [id]);

    if (movie.genres) {
        movie.genres = Object.values(movie.genres);

    } else {
        movie.genres = [];
    }

    return (
        <div className="mt-10 mx-24">
            <h1 className="text-3xl">{movie.title}</h1>
            <p className="text-sm text-gray-500">{movie.release_date}</p>
            <p className="text-sm text-gray-500">{movie.runtime} min</p>
            <div className="py-8">
                {movie.genres.map((g) => (
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500" key={g.genre}>{g.genre}</span>
                )
                )}
            </div>
            {movie.image !== "" &&
                <div className="mb-3">
                    <img src={movie.image} alt={movie.title} width={200} />
                </div>
            }
            <p> Description : {movie.description}</p>
        </div>
    );
}

export default Movie;