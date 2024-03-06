import React from "react";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa6";

const MovieInfo = (props) => {
    const movie = props.movie;

    const handleClose = () => {
        props.onClose();
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    if (movie.genres) {
        movie.genres = Object.values(movie.genres);
    } else {
        movie.genres = [];
    }

    const convertToHours = (runtime) => {
        const hours = Math.floor(runtime / 60);
        const minutes = runtime % 60;
        return `${hours.toString()}h ${minutes.toString()}m`;
    }

    const runtime = convertToHours(movie.runtime);

    const release_date = movie.release_date.split("-")[0];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto" onClick={handleClose}>
            <div className="relative bg-stone-900 rounded shadow-md w-1/2 rounded-[0.5rem] pb-8" onClick={handleModalClick}>
                <div className="flex items-center justify-center rounded-[0.5rem] relative">
                    <img src={`https://image.tmdb.org/t/p/original/${movie.backdrop}`} alt={movie.title} className="rounded-t-[0.5rem]" />
                    <div className="absolute bottom-0 w-full h-20 bg-gradient-to-b from-transparent to-stone-900"></div>
                    <div className="absolute bottom-10 left-10">
                        <Link to={`/movies/${movie.id}`} className="flex flex-row items-center justify-center bg-white text-black text-xl px-5 py-2 rounded">
                            <div className="px-2 w-15"><FaPlay /></div>
                            <div className="px-2 w-15">Play</div>
                        </Link>
                    </div>
                </div>
                <div className="absolute top-5 right-5 rounded-full bg-black w-10 h-10 flex items-center justify-center">
                    <button onClick={handleClose} className="text-white focus:outline-none">
                        <RxCross2 className="w-full text-2xl" />
                    </button>
                </div>

                <div className="flex flex-row w-full min-h-14">
                    <div className="mx-10 w-full">
                        <h1 className="text-5xl pt-8 pb-4">{movie.title}</h1>
                        <p className="text-md text-gray-500">{release_date}</p>
                        <p className="text-md text-gray-500">{runtime}</p>
                    </div>
                    <div className="w-full flex gap-4 items-center justify-end pr-10 max-w-full">
                        {movie.genres.map((g, index) => (
                            <div key={index}>
                                <span className="inline-flex items-center rounded bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                    {g.genre}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="mx-10 py-2 text-xl">{movie.description}</p>
            </div>
        </div>
    );
}

export default MovieInfo;
