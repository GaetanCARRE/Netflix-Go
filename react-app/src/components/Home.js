import React, { useState, useEffect } from 'react';
import Header from './Header';
import { HiOutlineVolumeOff, HiOutlineVolumeUp } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { LuInfo } from "react-icons/lu";
import MovieInfo from './MovieInfo';
import MoviesMap from './MoviesMap';
import ReactPlayer from 'react-player';

const Home = () => {
    const [movie, setMovie] = useState({});
    const [isMuted, setIsMuted] = useState(true);
    const [clicked, setClicked] = useState(false);
    const [movies, setMovies] = useState([])

    const handleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleMovieClick = () => {
        setClicked(true);
    }

    const handleClose = () => {
        setClicked(false);
    };

    const fetchMovie = async () => {
        try {
            const movieResponse = await fetch(`/random`);
            if (!movieResponse.ok) {
                throw new Error('Failed to fetch movie');
            }
            const movieData = await movieResponse.json();
            setMovie(movieData);
        } catch (error) {
            console.error('Error fetching movie:', error);
        }
    };

    useEffect(() => {
        fetchMovie();
        
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const requestOptions = {
            method: 'GET',
            headers: headers,
        };
        fetch(`/latest?count=12`, requestOptions)
            .then(response => response.json())
            .then(data => setMovies(data))
            .catch(error => console.log(error));
    }, []);

    if (movie.genres && !Array.isArray(movie.genres)) {
        movie.genres = Object.values(movie.genres);
    }

    return (
        <div className="bg-stone-950 min-h-screen text-white">
            <div className='relative w-full h-[80vh] overflow-hidden'>
                <Header className='absolute top-0 bg-transparent z-50 w-full' />
                
                <div className="absolute inset-0 z-0">
                    {movie.video_path ? (
                        <div className="w-full h-full pointer-events-none scale-125">
                            <ReactPlayer
                                url={movie.video_path}
                                width="100%"
                                height="100%"
                                playing={true}
                                muted={isMuted}
                                loop={true}
                                config={{
                                    youtube: {
                                        playerVars: { showinfo: 0, controls: 0, disablekb: 1, modestbranding: 1 }
                                    }
                                }}
                            />
                        </div>
                    ) : movie.image || movie.backdrop ? (
                        <img 
                            src={`https://image.tmdb.org/t/p/original/${(movie.backdrop || movie.image).replace(/^\/+/, '')}`} 
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-stone-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                </div>

                <div className="absolute bottom-[20%] left-12 z-10 max-w-2xl">
                    <h1 className="text-7xl font-bold mb-6 drop-shadow-2xl">{movie.title?.toUpperCase()}</h1>
                    <p className="text-xl mb-8 line-clamp-3 text-gray-200 drop-shadow-md">
                        {movie.description}
                    </p>
                    <div className="flex gap-4">
                        <Link to={`/movies/${movie.id}`} className="flex items-center bg-white text-black px-8 py-3 rounded-md font-bold text-xl hover:bg-gray-200 transition">
                            <FaPlay className="mr-3" /> Lecture
                        </Link>
                        <button 
                            onClick={handleMovieClick}
                            className="flex items-center bg-gray-500 bg-opacity-50 text-white px-8 py-3 rounded-md font-bold text-xl hover:bg-opacity-40 transition"
                        >
                            <LuInfo className="mr-3" /> Plus d'infos
                        </button>
                    </div>
                </div>

                <button 
                    onClick={handleMute} 
                    className="absolute bottom-[20%] right-12 z-10 text-2xl rounded-full border-2 p-3 border-gray-400 text-gray-400 hover:text-white hover:border-white transition"
                >
                    {isMuted ? <HiOutlineVolumeOff /> : <HiOutlineVolumeUp />}
                </button>
            </div>

            <div className="px-12 -mt-20 relative z-20 pb-20">
                <h2 className='text-2xl font-semibold mb-6 text-gray-400 uppercase tracking-widest'>Nouveautés</h2>
                <MoviesMap movies={movies} />
            </div>

            {clicked && (
                <MovieInfo movie={movie} onClose={handleClose} />
            )}
        </div>
    );
};

export default Home;
