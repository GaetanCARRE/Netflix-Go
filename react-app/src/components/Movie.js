import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";

const Movie = () => {
    const [movie, setMovie] = useState({});
    const [videoUrl, setVideoUrl] = useState('');
    const handleBack = () => {
        window.history.back();
    }
    let { id } = useParams();

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const movieResponse = await fetch(`${process.env.REACT_APP_BACKEND}/movies/${id}`);
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
                const videoResponse = await fetch(`${process.env.REACT_APP_BACKEND}/videos/${id}.mp4`);
                if (!videoResponse.ok) {
                    throw new Error('Failed to fetch video');
                }
                // Since we're fetching the video directly, set the video URL directly
                setVideoUrl(`${process.env.REACT_APP_BACKEND}/videos/${id}.mp4`);
            } catch (error) {
                console.error('Error fetching video:', error);
            }
        };

        fetchMovie();
        fetchVideo();
    }, [id]);

    if (movie.genres) {
        movie.genres = Object.values(movie.genres);
    } else {
        movie.genres = [];
    }

    return (
        <>
            <div className="w-full h-full">
                {videoUrl && (
                    <video controls autoPlay className="h-screen w-full">
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}
            </div>
            <div className="text-4xl absolute top-5 left-5">
                <IoChevronBack onClick={handleBack}/>
            </div>
        </>
    );
}

export default Movie;
