import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Header from "./Header";

const ManageCatalog = () => {
    const [movies, setMovies] = useState([])
    const { jwtToken } = useOutletContext();
    console.log("jwtToken: ", jwtToken);
    const navigate = useNavigate();
    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login");
            return;
        }
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${jwtToken}`);
        const requestOptions = {
            method: 'GET',
            headers: headers,
        };
        fetch(`${process.env.REACT_APP_BACKEND}/admin/movies`, requestOptions)
            .then(response => response.json())
            .then(data => setMovies(data))
            .catch(error => console.log(error));
    }, [jwtToken, navigate]);

    return (
        <>
            <Header />
            <div className="mx-20">
                <h1 className="text-3xl text-center py-8">Manage Catalog</h1>


                <div className="relative overflow-x-auto shadow-md rounded-xl">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    director
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    runtime
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                            {movies.map((movie) => (
                                <tr key={movie.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link to={`/admin/movie/${movie.id}`}>{movie.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{movie.director}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{movie.runtime}</td>
                                </tr>))}
                        </tbody>
                    </table>
                </div>

            </div>
        </>

    );
}

export default ManageCatalog;