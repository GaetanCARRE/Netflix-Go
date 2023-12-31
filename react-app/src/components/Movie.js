import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";

const Movie = () => {
    const [movie, setMovie] = useState({});
    let { id } = useParams();

    useEffect(() => {
        let my_movie = {
            id: 1,
            title: 'The Godfather',
            director: 'Francis Ford Coppola',
            runtime: 175,
            description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
            release_date: '1972-03-24',
            genres: [
                'Crime',
                'Drama'
            ],
        }
        setMovie(my_movie);
    }, [id]);

    return (
        <div>
            <h1>Movie : {movie.title}</h1>
            <p>{movie.description}</p>
        </div>
    );
}

export default Movie;