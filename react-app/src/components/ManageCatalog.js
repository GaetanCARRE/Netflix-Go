import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Header from "./Header";
import { FaEdit, FaPlus, FaTrash, FaFilm, FaTv } from "react-icons/fa";

const ManageCatalog = () => {
    const [movies, setMovies] = useState([])
    const [filter, setFilter] = useState('all')
    const { jwtToken, isAdmin } = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (jwtToken === "" || !isAdmin) {
            navigate("/");
            return;
        }
        
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${jwtToken}`);
        const requestOptions = {
            method: 'GET',
            headers: headers,
        };
        fetch(`/admin/movies`, requestOptions)
            .then(response => response.json())
            .then(data => setMovies(data))
            .catch(error => console.log(error));
    }, [jwtToken, isAdmin, navigate]);

    const filteredMovies = movies.filter(m => {
        if (filter === 'all') return true;
        if (filter === 'movies') return m.type === 'movie' || !m.type;
        if (filter === 'series') return m.type === 'series';
        return true;
    });

    return (
        <>
            <Header />
            <div className="min-h-screen bg-stone-950 text-white">
                <div className="max-w-7xl mx-auto px-8 py-12">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Manage Catalog</h1>
                            <p className="text-gray-400">Manage your movies and series</p>
                        </div>
                        <Link 
                            to="/admin/movie/0"
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-medium transition"
                        >
                            <FaPlus /> Add
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4 mb-8">
                        <button 
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg transition ${filter === 'all' ? 'bg-white text-black' : 'bg-stone-800 text-gray-300 hover:bg-stone-700'}`}
                        >
                            All ({movies.length})
                        </button>
                        <button 
                            onClick={() => setFilter('movies')}
                            className={`px-4 py-2 rounded-lg transition ${filter === 'movies' ? 'bg-white text-black' : 'bg-stone-800 text-gray-300 hover:bg-stone-700'}`}
                        >
                            <FaFilm className="inline mr-2" />
                            Movies ({movies.filter(m => m.type === 'movie' || !m.type).length})
                        </button>
                        <button 
                            onClick={() => setFilter('series')}
                            className={`px-4 py-2 rounded-lg transition ${filter === 'series' ? 'bg-white text-black' : 'bg-stone-800 text-gray-300 hover:bg-stone-700'}`}
                        >
                            <FaTv className="inline mr-2" />
                            Series ({movies.filter(m => m.type === 'series').length})
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-stone-900 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-stone-800 text-gray-400 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4 text-left">Title</th>
                                    <th className="px-6 py-4 text-left">Type</th>
                                    <th className="px-6 py-4 text-left">Duration</th>
                                    <th className="px-6 py-4 text-left">Year</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800">
                                {filteredMovies.map((movie) => (
                                    <tr key={movie.id} className="hover:bg-stone-800 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {movie.image && (
                                                    <img 
                                                        src={`https://image.tmdb.org/t/p/w92/${movie.image.replace(/^\/+/, '')}`} 
                                                        alt={movie.title}
                                                        className="w-12 h-16 object-cover rounded"
                                                    />
                                                )}
                                                <span className="font-medium">{movie.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${movie.type === 'series' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                                {movie.type === 'series' ? 'Series' : 'Movie'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{movie.runtime} min</td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {movie.release_date?.split('-')[0]}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link 
                                                    to={`/admin/movie/${movie.id}`}
                                                    className="p-2 rounded-lg bg-stone-700 hover:bg-stone-600 transition"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredMovies.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                No content found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ManageCatalog;
