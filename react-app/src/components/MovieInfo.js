import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { Link, useOutletContext } from "react-router-dom";
import { FaPlay, FaPlus, FaCheck } from "react-icons/fa6";

const MovieInfo = (props) => {
    const movie = props.movie;
    const { jwtToken } = useOutletContext();
    const [inList, setInList] = useState(false);
    const [adding, setAdding] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            props.onClose();
        }, 200);
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
    const release_date = movie.release_date?.split("-")[0] || '';

    return (
        <div 
            className={`fixed inset-0 flex items-center justify-center bg-black z-50 overflow-auto transition-all duration-200 ${isVisible ? 'bg-opacity-80' : 'bg-opacity-0'}`} 
            onClick={handleClose}
        >
            <div 
                className={`relative bg-stone-900 rounded-xl w-full max-w-5xl mx-4 pb-6 transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={handleModalClick}
            >
                {/* Close button */}
                <button 
                    onClick={handleClose} 
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-stone-900 bg-opacity-80 flex items-center justify-center hover:bg-opacity-100 transition"
                >
                    <RxCross2 className="text-white text-xl" />
                </button>

                {/* Hero section with backdrop */}
                <div className="relative overflow-hidden rounded-t-xl h-[450px]">
                    <img 
                        src={`https://image.tmdb.org/t/p/original/${((movie.backdrop || movie.image) || '').replace(/^\/+/, '')}`} 
                        alt={movie.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-transparent to-transparent"></div>
                    
                    {/* Action buttons */}
                    <div className="absolute bottom-8 left-8 flex gap-4 items-center">
                        <Link 
                            to={`/movies/${movie.id}`} 
                            className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-200 transition shadow-lg"
                        >
                            <FaPlay /> Play
                        </Link>
                        <button 
                            onClick={handleAddToList}
                            disabled={adding || inList}
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition shadow-lg ${inList ? 'bg-green-600 text-white' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30 border-2 border-gray-400'}`}
                        >
                            {inList ? <FaCheck /> : <FaPlus />}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 pt-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
                            <div className="flex items-center gap-3 text-gray-400 text-sm mb-4">
                                <span>{release_date}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                                <span>{runtime}</span>
                                {movie.type && movie.type !== 'movie' && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                                        <span className="uppercase text-xs border border-gray-500 px-2 py-0.5 rounded">{movie.type}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {movie.genres.map((g, index) => (
                            <span 
                                key={index} 
                                className="px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-medium"
                            >
                                {g.genre}
                            </span>
                        ))}
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-lg leading-relaxed">{movie.description}</p>
                </div>
            </div>
        </div>
    );
}

export default MovieInfo;
