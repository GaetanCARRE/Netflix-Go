import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';



const Home = () => {
    const [movie, setMovie] = useState({});
    const [videoUrl, setVideoUrl] = useState('');
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);

    const handleMute = () => {
        setIsMuted(!isMuted);
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
        }
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
    }, [movie.id]);

    if (movie.genres) {
        movie.genres = Object.values(movie.genres);
    } else {
        movie.genres = [];
    }

    return (
        <>
        <div className='fixed w-full leading-[0px] top-0'>
            <Header className='relative' /> 
            {videoUrl && (
                <div className="absolute top-0">
                    <video ref={videoRef} autoPlay muted={isMuted} className="w-full leading-[0px]">
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-b from-transparent to-stone-950"></div>
                    <button onClick={handleMute} className="absolute top-4 right-4 z-10">
                        {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                </div>
            )}
        </div>
        </>
    );
};

export default Home;
