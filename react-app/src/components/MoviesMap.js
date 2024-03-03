import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TfiArrowCircleDown } from "react-icons/tfi";
import MovieInfo from "./MovieInfo"; // Assuming you have a MovieInfo component

const MoviesMap = ({ movies }) => {
    const [selectedMovie, setSelectedMovie] = useState(null);

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
    };

    const handleClose = () => {
        setSelectedMovie(null);
    };

    return (
        <div className="flex justify-center relative mt-10">
            <div className="grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-10">
                {movies.map((movie) => (
                    <div key={movie.id} className="shadow-md sm:rounded-lg">
                        <Link to={`/movies/${movie.id}`} >
                            <img src={`https://image.tmdb.org/t/p/w400/${movie.image}`} alt={movie.title} width={300} />
                        </Link>

                        <div className="pt-2 grid grid-cols-4">
                            <div className="col-span-3">
                                <Link to={`/movies/${movie.id}`} >
                                    <h2 className="text-lg font-semibold">{movie.title}</h2>
                                    <p className="text-md text-gray-600 dark:text-gray-300">{movie.runtime} min</p>
                                </Link>
                            </div>
                            <div className="flex items-center justify-center ">
                                <TfiArrowCircleDown className="w-1/2 h-1/2 cursor-pointer" onClick={() => handleMovieClick(movie)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedMovie && (
                <div className="">
                    <div className="rounded shadow-md h-screen">
                        <MovieInfo movie={selectedMovie} onClose={handleClose} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MoviesMap;
