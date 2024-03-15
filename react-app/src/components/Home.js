import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import { HiOutlineVolumeOff } from "react-icons/hi";
import { HiOutlineVolumeUp } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { LuInfo } from "react-icons/lu";
import MovieInfo from './MovieInfo';
import MoviesMap from './MoviesMap';


const Home = () => {
    const [movie, setMovie] = useState({});
    const [videoUrl, setVideoUrl] = useState('');
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);
    const [clicked, setClicked] = useState(false);
    const [movies, setMovies] = useState([])

    console.log(movie);
    const handleMute = () => {
        setIsMuted(!isMuted);
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
        }
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

    const fetchVideo = async () => {
        try {
            const videoResponse = await fetch(`/videos/${movie.id}.mp4`);
            if (!videoResponse.ok) {
                throw new Error('Failed to fetch video');
            }
            // Since we're fetching the video directly, set the video URL directly
            setVideoUrl(`/videos/${movie.id}.mp4`);
        } catch (error) {
            console.error('Error fetching video:', error);
        }
    };

    useEffect(() => {
        fetchMovie();
    }, []);

    useEffect(() => {
        if (movie.id) {
            fetchVideo();
        }
    }, [movie.id, fetchMovie]);

    useEffect(() => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const requestOptions = {
            method: 'GET',
            headers: headers,
        };
        fetch(`/latest?count=6`, requestOptions)
            .then(response => response.json())
            .then(data => setMovies(data))
            .catch(error => console.log(error));

    }, []);

    if (movie.genres) {
        movie.genres = Object.values(movie.genres);
    } else {
        movie.genres = [];
    }


    return (
        <div>

            <div className='w-full leading-[0px] top-0 right-0 left-0'>
                <Header className='absolute bg-opacity-50 z-10 w-full' />
                <div className="relative top-0 z-0 w-full">

                    {videoUrl && (
                        <>
                            <video ref={videoRef} autoPlay muted={isMuted} className="w-full leading-[0px]">
                                <source src={videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-b from-transparent to-stone-950"></div>

                            <button onClick={handleMute} className="absolute bottom-36 right-16 z-10 text-2xl rounded-full border-[2px] p-2 border-white">
                                {isMuted ? <HiOutlineVolumeOff /> : <HiOutlineVolumeUp />}
                            </button>

                            <div className="absolute flex bottom-60 left-16 gap-4">
                                <h1 className="text-6xl text-white font-bold font-sackers">{movie.title.toUpperCase()}</h1>
                            </div>

                            <div className="absolute flex bottom-36 left-16 gap-4">
                                <div className="relative">
                                    <Link to={`/movies/${movie.id}`} className="flex flex-row items-center justify-center bg-white text-black text-2xl px-8 py-3 rounded opacity-95">
                                        <div className="px-2 w-15"><FaPlay /></div>
                                        <div className="px-2 w-15">Play</div>
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="flex flex-row items-center justify-center bg-gray-500 bg-opacity-50 text-white text-2xl px-8 py-3 rounded" onClick={() => handleMovieClick()}>
                                        <div className="px-2 w-15"><LuInfo /></div>
                                        <div className="px-2 w-15">More Info</div>
                                    </div>
                                </div>

                            </div>
                        </>
                    )}

                </div>




            </div>
            <h2 className='font-barlow text-3xl px-12'>News</h2>
            <div className='relative px-12'>
                <MoviesMap movies={movies} />
            </div>
            {clicked && (
                <div className="">
                    <div className="rounded shadow-md h-screen">
                        <MovieInfo movie={movie} onClose={handleClose} />
                    </div>
                </div>
            )}

        </div>
    );
};

export default Home;
