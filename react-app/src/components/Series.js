import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MoviesMap from "./MoviesMap";
import Header from "./Header";

const Series = () => {
    const [series, setSeries] = useState([])
    const { jwtToken } = useOutletContext();

    useEffect(() => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        if (jwtToken) {
            headers.append('Authorization', `Bearer ${jwtToken}`);
        }
        const requestOptions = {
            method: 'GET',
            headers: headers,
        };
        fetch(`/movies`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const filtered = data.filter(m => m.type === 'series');
                setSeries(filtered);
            })
            .catch(error => console.log(error));
    }, [jwtToken]);

    return (
        <>
            <Header />
            <div className="py-6 px-12">
                <h1 className="text-4xl text-white font-bold mb-6">Series</h1>
                {series.length > 0 ? (
                    <MoviesMap movies={series} />
                ) : (
                    <p className="text-gray-400">No series available</p>
                )}
            </div>
        </>
    );
}

export default Series;
