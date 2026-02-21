import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams, Link } from "react-router-dom";
import Input from "./form/Input";
import TextArea from "./form/TextArea";
import CheckBox from "./form/CheckBox";
import Swal from "sweetalert2";
import Header from "./Header";
import { FaArrowLeft, FaSave, FaTrash } from "react-icons/fa";

const EditMovie = () => {
    const navigate = useNavigate();
    const { jwtToken, isAdmin } = useOutletContext();

    const [error, setError] = useState(null);
    const [errors, setErrors] = useState([]);

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    let { id } = useParams();
    if (id === undefined) {
        id = 0;
    }

    const [movie, setMovie] = useState({
        id: parseInt(id),
        title: "",
        release_date: "",
        runtime: "",
        description: "",
        genres: [],
        genres_array: Array(13).fill(false),
        type: "movie",
    })

    useEffect(() => {
        if (jwtToken === "" || !isAdmin) {
            navigate("/");
            return;
        }

        if (id === 0) {
            setMovie({
                id: 0,
                title: "",
                release_date: "",
                runtime: "",
                description: "",
                genres: [],
                genres_array: [],
                type: "movie",
            })

            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch(`/genres`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    const checks = [];
                    data.forEach(g => {
                        checks.push({ id: g.id, checked: false, genre: g.genre });
                    })
                    setMovie(m => ({
                        ...m,
                        genres: checks,
                        genres_array: [],
                    }))
                })
                .catch(err => console.log(err))
        } else {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + jwtToken);
            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch(`/admin/movies/${id}`, requestOptions)
                .then((response) => {
                    if (response.status !== 200) {
                        setError("Invalid response code: " + response.status);
                    }
                    return response.json();
                })
                .then((data) => {
                    data.movie.release_date = new Date(data.movie.release_date).toISOString().split('T')[0];

                    const checks = [];
                    data.genres.forEach(g => {
                        if (data.movie.genres_array && data.movie.genres_array.indexOf(g.id) !== -1) {
                            checks.push({ id: g.id, checked: true, genre: g.genre });
                        } else {
                            checks.push({ id: g.id, checked: false, genre: g.genre });
                        }
                    })

                    setMovie({
                        ...data.movie,
                        genres: checks,
                    })
                })
                .catch((error) => console.log(error))
        }
    }, [id, jwtToken, isAdmin, navigate])

    const handleSubmit = (event) => {
        event.preventDefault();

        let errors = [];
        let required = [
            { field: movie.title, name: "title" },
            { field: movie.release_date, name: "release_date" },
            { field: movie.runtime, name: "runtime" },
            { field: movie.description, name: "description" },
        ]

        required.forEach(function (obj) {
            if (obj.field === "") {
                errors.push(obj.name);
            }
        })

        if (movie.genres_array.length === 0) {
            Swal.fire({
                title: 'Error!',
                text: 'You must select at least one genre!',
                icon: 'error',
                confirmButtonText: 'OK',
            })
            errors.push("genres");
        }

        setErrors(errors);

        if (errors.length > 0) {
            return false;
        }

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        let method = "PUT";
        if (movie.id > 0) {
            method = "PATCH";
        }

        const requestBody = movie;
        requestBody.release_date = new Date(movie.release_date);
        requestBody.runtime = parseInt(movie.runtime, 10);

        let requestOptions = {
            body: JSON.stringify(requestBody),
            method: method,
            headers: headers,
            credentials: "include",
        }

        fetch(`/admin/movies/${movie.id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    navigate("/manage-catalog");
                }
            })
            .catch(err => console.log(err))
    }

    const handleChange = () => (event) => {
        let value = event.target.value;
        let name = event.target.name;
        setMovie({
            ...movie,
            [name]: value,
        })
    }

    const handleCheck = (event, position) => {
        let tmpArr = movie.genres;
        tmpArr[position].checked = !tmpArr[position].checked;

        let tmpIDs = movie.genres_array;
        if (!event.target.checked) {
            tmpIDs.splice(tmpIDs.indexOf(event.target.value), 1);
        } else {
            tmpIDs.push(parseInt(event.target.value, 10));
        }

        setMovie({
            ...movie,
            genres_array: tmpIDs,
        })
    }

    const handleOptionChange = (event) => {
        setMovie({
            ...movie,
            type: event.target.value,
        })
    };

    const confirmDelete = () => {
        Swal.fire({
            title: 'Delete this content?',
            text: "This action is irreversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#374151',
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                let headers = new Headers();
                headers.append("Authorization", "Bearer " + jwtToken)

                const requestOptions = {
                    method: "DELETE",
                    headers: headers,
                }

                fetch(`/admin/movies/${movie.id}`, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            console.log(data.error);
                        } else {
                            navigate("/manage-catalog");
                        }
                    })
                    .catch(err => console.log(err));
            }
        })
    }

    if (error !== null) {
        return <div className="text-4xl text-center m-20">Error: {error.message}</div>
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-stone-950 text-white">
                <div className="max-w-4xl mx-auto px-8 py-12">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/manage-catalog" className="p-2 hover:bg-stone-800 rounded-lg transition">
                            <FaArrowLeft className="text-xl" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">
                                {movie.id > 0 ? 'Edit' : 'Add'} Content
                            </h1>
                            <p className="text-gray-400 mt-1">
                                {movie.id > 0 ? `Editing "${movie.title || '...'}"` : 'Add a new movie or series'}
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-stone-900 rounded-xl p-8">
                        {/* Type selection */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-400 mb-3">Content Type</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition ${movie.type === "movie" ? 'border-red-600 bg-red-600 bg-opacity-20' : 'border-stone-700 hover:border-stone-600'}`}>
                                    <input
                                        type="radio"
                                        value="movie"
                                        checked={movie.type === "movie"}
                                        onChange={handleOptionChange}
                                        className="sr-only"
                                    />
                                    <span className="block text-center font-medium">Movie</span>
                                </label>
                                <label className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition ${movie.type === "series" ? 'border-red-600 bg-red-600 bg-opacity-20' : 'border-stone-700 hover:border-stone-600'}`}>
                                    <input
                                        type="radio"
                                        value="series"
                                        checked={movie.type === "series"}
                                        onChange={handleOptionChange}
                                        className="sr-only"
                                    />
                                    <span className="block text-center font-medium">Series</span>
                                </label>
                            </div>
                        </div>

                        <input type="hidden" name="id" defaultValue={movie.id} />

                        <div className="space-y-6">
                            <Input
                                title={"Title"}
                                className={"w-full bg-stone-800 border-stone-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"}
                                type={"text"}
                                name={"title"}
                                value={movie.title}
                                onChange={handleChange("title")}
                                errorDiv={hasError("title") ? "text-red-500 text-sm mt-1" : "hidden"}
                                errorMsg={"Please enter a title"}
                            />

                            <div className="grid grid-cols-2 gap-6">
                                <Input
                                    title={"Release Date"}
                                    className={"w-full bg-stone-800 border-stone-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"}
                                    type={"date"}
                                    name={"release_date"}
                                    value={movie.release_date}
                                    onChange={handleChange("release_date")}
                                    errorDiv={hasError("release_date") ? "text-red-500 text-sm mt-1" : "hidden"}
                                    errorMsg={"Please enter a date"}
                                />

                                <Input
                                    title={"Duration (minutes)"}
                                    className={"w-full bg-stone-800 border-stone-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"}
                                    type={"number"}
                                    name={"runtime"}
                                    value={movie.runtime}
                                    onChange={handleChange("runtime")}
                                    errorDiv={hasError("runtime") ? "text-red-500 text-sm mt-1" : "hidden"}
                                    errorMsg={"Please enter a duration"}
                                />
                            </div>

                            <TextArea
                                title="Description"
                                name={"description"}
                                value={movie.description}
                                rows={"4"}
                                onChange={handleChange("description")}
                                errorMsg={"Please enter a description"}
                                errorDiv={hasError("description") ? "text-red-500 text-sm mt-1" : "hidden"}
                                className={"w-full bg-stone-800 border-stone-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"}
                            />

                            {/* Genres */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-3">Genres</label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                    {movie.genres && movie.genres.length > 0 && movie.genres.map((g, index) => (
                                        <label 
                                            key={index}
                                            className={`p-2 rounded-lg border cursor-pointer transition text-center text-sm ${g.checked ? 'border-red-600 bg-red-600 bg-opacity-20 text-white' : 'border-stone-700 text-gray-400 hover:border-stone-600'}`}
                                        >
                                            <input
                                                type="checkbox"
                                                name={"genre"}
                                                onChange={(event) => handleCheck(event, index)}
                                                value={g.id}
                                                checked={g.checked}
                                                className="sr-only"
                                            />
                                            {g.genre}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mt-8 pt-8 border-t border-stone-800">
                            <button
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition"
                                type="submit"
                            >
                                <FaSave /> Save
                            </button>
                            {movie.id > 0 && (
                                <button
                                    type="button"
                                    className="flex items-center gap-2 bg-stone-800 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-medium transition"
                                    onClick={confirmDelete}
                                >
                                    <FaTrash /> Delete
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EditMovie;
