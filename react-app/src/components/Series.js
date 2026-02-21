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
                const filtered = data.filter(m => m.type === 'series' || m.title.includes('House') || m.title.includes('Game') || m.title.includes('Stranger') || m.title.includes('Breaking') || m.title.includes('Witcher') || m.title.includes('Money') || m.title.includes('Wednesday') || m.title.includes('Dark') || m.title.includes('Crown') || m.title.includes('Ozark') || m.title.includes('Narcos') || m.title.includes('Prison') || m.title.includes('Sherlock') || m.title.includes('Friends') || m.title.includes('Office') || m.title.includes('Better') || m.title.includes('Boys') || m.title.includes('Arcane') || m.title.includes('Last'));
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
