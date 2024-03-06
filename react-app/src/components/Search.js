import React, { useState, useEffect } from 'react';
import MoviesMap from './MoviesMap';

const Search = () => {
    const [prompt, setPrompt] = useState('');
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(`/search?q=${prompt}`);
                const data = await response.json();
                setMovies(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMovies();
    }, [prompt]);

    return (
        <div>
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a movie"
            />
            {movies !== null && movies.length > 0 && <MoviesMap movies={movies} />}
            
        </div>
    );
};

export default Search;
