import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import VideoPlayer from "./VideoPlayer";

const Movie = () => {
    const [movie, setMovie] = useState({});
    const { jwtToken } = useOutletContext();
    
    const handleBack = () => {
        window.history.back();
    }
    
    let { id } = useParams();

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const movieResponse = await fetch(`/movies/${id}`);
                if (!movieResponse.ok) {
                    throw new Error('Failed to fetch movie');
                }
                const movieData = await movieResponse.json();
                setMovie(movieData);
            } catch (error) {
                console.error('Error fetching movie:', error);
            }
        };

        fetchMovie();
    }, [id]);

    return (
        <div className="bg-black h-screen w-full relative">
            <div className="w-full h-full">
                {!movie.id ? (
                    <div className="flex items-center justify-center h-full text-white text-2xl">
                        Loading...
                    </div>
                ) : movie.video_path ? (
                    <VideoPlayer 
                        path={movie.video_path} 
                        movieId={id} 
                        jwtToken={jwtToken}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-white text-2xl">
                        Trailer not available
                    </div>
                )}
            </div>
            <div className="text-4xl absolute top-5 left-5 z-50 text-white cursor-pointer hover:scale-110 transition">
                <IoChevronBack onClick={handleBack}/>
            </div>
        </div>
    );
}

export default Movie;
