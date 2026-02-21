import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Link, useOutletContext } from "react-router-dom";
import { FaPlay, FaPlus, FaCheck } from "react-icons/fa6";

const MovieInfo = (props) => {
    const movie = props.movie;
    const { jwtToken } = useOutletContext();
    const [inList, setInList] = useState(false);
    const [adding, setAdding] = useState(false);

    const handleClose = () => {
        props.onClose();
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    const handleAddToList = async () => {
        if (!jwtToken) {
            alert("Please log in to add to your list");
            return;
        }

        setAdding(true);
        try {
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', `Bearer ${jwtToken}`);

            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ movie_id: movie.id }),
            };

            const response = await fetch(`/user-list`, requestOptions);
            if (response.ok) {
                setInList(true);
            }
        } catch (error) {
            console.log("Error adding to list:", error);
        }
        setAdding(false);
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 overflow-auto" onClick={handleClose}>
            <div className="relative bg-stone-900 rounded shadow-md w-full max-w-6xl mx-4 rounded-[0.5rem] pb-8" onClick={handleModalClick}>
                <div className="flex items-center justify-center rounded-[0.5rem] relative overflow-hidden h-[600px]">
                    <img 
                        src={`https://image.tmdb.org/t/p/original/${((movie.backdrop || movie.image) || '').replace(/^\/+/, '')}`} 
                        alt={movie.title} 
                        className="rounded-t-[0.5rem] w-full h-full object-cover" 
                    />
                    <div className="absolute bottom-0 w-full h-40 bg-gradient-to-b from-transparent to-stone-900"></div>
                    <div className="absolute bottom-8 left-10 flex gap-4 items-center">
                        <Link to={`/movies/${movie.id}`} className="flex flex-row items-center justify-center bg-white text-black text-2xl px-8 py-3 rounded font-bold hover:bg-gray-200 transition shadow-lg">
                            <div className="pr-2"><FaPlay /></div>
                            <div>Lecture</div>
                        </Link>
                        <button 
                            onClick={handleAddToList}
                            disabled={adding || inList}
                            className={`flex items-center justify-center text-2xl w-12 h-12 rounded-full border-2 transition ${inList ? 'bg-green-600 border-green-600 text-white' : 'bg-black bg-opacity-40 border-gray-400 text-white hover:border-white'}`}
                        >
                            {inList ? <FaCheck size={20} /> : <FaPlus size={20} />}
                        </button>
                    </div>
                </div>
                <div className="absolute top-5 right-5 rounded-full bg-black bg-opacity-70 w-10 h-10 flex items-center justify-center">
                    <button onClick={handleClose} className="text-white focus:outline-none">
                        <RxCross2 className="w-full text-2xl" />
                    </button>
                </div>

                <div className="flex flex-col w-full min-h-14 px-6">
                    <h1 className="text-3xl pt-6 pb-2 text-white font-bold">{movie.title}</h1>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span>{release_date}</span>
                        <span className="text-gray-600">•</span>
                        <span>{runtime}</span>
                        {movie.type && (
                            <>
                                <span className="text-gray-600">•</span>
                                <span className="uppercase text-xs border border-gray-500 px-1 rounded">{movie.type}</span>
                            </>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {movie.genres.map((g, index) => (
                            <span key={index} className="inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
                                {g.genre}
                            </span>
                        ))}
                    </div>
                </div>
                <p className="mx-6 py-4 text-gray-300">{movie.description}</p>
            </div>
        </div>
    );
}

export default MovieInfo;
