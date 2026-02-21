import React, { useState, useEffect } from 'react';
import { useHeaderContext } from './HeaderContext';
import MoviesMap from './MoviesMap';
import Header from './Header';


const Search = () => {
    const {prompt} = useHeaderContext();
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
        <>
            <Header />
            <div className='flex bg-[#1c1c1c] w-full h-screen'>
                    {movies !== null && movies.length > 0 && <MoviesMap movies={movies} />}
            </div>
        </>
    );
};

export default Search;
