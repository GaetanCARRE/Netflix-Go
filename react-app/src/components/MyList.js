import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MoviesMap from "./MoviesMap";
import Header from "./Header";

const MyList = () => {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const { jwtToken } = useOutletContext();

    useEffect(() => {
        if (!jwtToken) {
            setLoading(false);
            return;
        }

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${jwtToken}`);
        
        const requestOptions = {
            method: 'GET',
            headers: headers,
        };
        
        fetch(`/user-list`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setMovies(data || []);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }, [jwtToken]);

    return (
        <>
            <Header />
            <div className="py-6 px-12">
                <h1 className="text-4xl text-white font-bold mb-6">My List</h1>
                {loading ? (
                    <p className="text-gray-400">Loading...</p>
                ) : !jwtToken ? (
                    <p className="text-gray-400">Please log in to see your list</p>
                ) : movies.length > 0 ? (
                    <MoviesMap movies={movies} />
                ) : (
                    <p className="text-gray-400">Your list is empty. Add some movies!</p>
                )}
            </div>
        </>
    );
}

export default MyList;
