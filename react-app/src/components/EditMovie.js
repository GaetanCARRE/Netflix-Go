import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Input from "./form/Input";
import TextArea from "./form/TextArea";
import CheckBox from "./form/CheckBox";
import Swal from "sweetalert2";

const EditMovie = () => {
    const navigate = useNavigate();
    const { jwtToken } = useOutletContext();

    const [error, setError] = useState(null);
    const [errors, setErrors] = useState([]);


    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }



    // get id from the URL
    let { id } = useParams();
    console.log("id is", id);
    if (id === undefined) {
        console.log("id is undefined")
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
        if (jwtToken === "") {
            navigate("/login");
            return;
        }

        if (id === 0) {
            // adding a movie
            setMovie({
                id: 0,
                title: "",
                release_date: "",
                runtime: "",
                description: "",
                genres: [],
                genres_array: Array(13).fill(false),
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
                .catch(err => {
                    console.log(err);
                })
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
                    console.log("data is", data);
                    data.movie.release_date = new Date(data.movie.release_date).toISOString().split('T')[0];

                    const checks = [];
                    data.genres.forEach(g => {
                        if (data.movie.genres_array.indexOf(g.id) !== -1) {
                            checks.push({ id: g.id, checked: true, genre: g.genre });
                        } else {
                            checks.push({ id: g.id, checked: false, genre: g.genre });
                        }
                    })
                    console.log("checks is", checks);

                    setMovie({
                        ...data.movie,
                        genres: checks,
                    })

                })
                .catch((error) => {
                    console.log(error);
                })


        }

    }, [id, jwtToken, navigate])

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
                text: 'You must choose at least one genre!',
                icon: 'error',
                confirmButtonText: 'OK',
            })
            errors.push("genres");
        }

        setErrors(errors);

        if (errors.length > 0) {
            return false;
        }

        // passed validation, so save changes
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        // assume we are adding a new movie
        let method = "PUT";
        if (movie.id > 0) {
            method = "PATCH";
        }
        console.log("method is", method);

        const requestBody = movie;
        // we need to covert the values in JSON for release date (to date)
        // and for runtime to int

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
            .catch(err => {
                console.log(err);
            })
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
        console.log("handleCheck called");
        console.log("value in handleCheck:", event.target.value);
        console.log("checked is", event.target.checked);
        console.log("position is", position);
        console.log("genres_array is", movie.genres_array)

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
            title: 'Delete movie?',
            text: "You cannot undo this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
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
                    .catch(err => { console.log(err) });
            }
        })
    }
    if (error !== null) {
        return <div className="text-4xl text-center m-20">Error: {error.message}</div>
    }
    else {
        return (
            <div className="mx-20 text-xl">
                <h2 className="text-4xl text-center py-8">Add/Edit Movie</h2>
                <hr className="py-8"/>

                <form onSubmit={handleSubmit}>

                    <input type="hidden" name="id" defaultValue={movie.id} id="id"></input>
                    <input
                        type="radio"
                        value="movie"
                        checked={movie.type === "movie"}
                        onChange={(event) => handleOptionChange(event)}
                    /> Movie
                    <br />
                    <input
                        type="radio"
                        value="serie"
                        checked={movie.type === "serie"}
                        onChange={(event) => handleOptionChange(event)}

                    /> Series
                    <Input
                        title={"Title"}
                        className={"form-control"}
                        type={"text"}
                        name={"title"}
                        value={movie.title}
                        onChange={handleChange("title")}
                        errorDiv={hasError("title") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a title"}
                    />

                    <Input
                        title={"Release Date"}
                        className={"form-control"}
                        type={"date"}
                        name={"release_date"}
                        value={movie.release_date}
                        onChange={handleChange("release_date")}
                        errorDiv={hasError("release_date") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a release date"}
                    />

                    <Input
                        title={"Runtime"}
                        className={"form-control"}
                        type={"text"}
                        name={"runtime"}
                        value={movie.runtime}
                        onChange={handleChange("runtime")}
                        errorDiv={hasError("runtime") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a runtime"}
                    />

                    <TextArea
                        title="Description"
                        name={"description"}
                        value={movie.description}
                        rows={"3"}
                        onChange={handleChange("description")}
                        errorMsg={"Please enter a description"}
                        errorDiv={hasError("description") ? "text-danger" : "d-none"}
                    />

                    <hr className="my-8"/>

                    <h3 className="mb-5">Genres</h3>
                    {movie.genres && movie.genres.length > 1 &&
                        <div className="flex justify-center">
                            {Array.from(movie.genres).map((g, index) =>
                                <CheckBox
                                    title={g.genre}
                                    name={"genre"}
                                    key={index}
                                    id={"genre-" + index}
                                    onChange={(event) => handleCheck(event, index)}
                                    value={g.id}
                                    checked={movie.genres[index].checked}
                                />
                            )}
                        </div>
                    }

                    <hr className="my-8"/>


                    <button
                        className="bg-blue-500 hover:font-semibold text-white py-2 px-4 hover:border hover:border-blue-500 border-transparent rounded mr-2"
                        type="submit"
                    >
                        Save
                    </button>
                    {movie.id > 0 && (
                        <a
                            href="#!"
                            type="button"
                            className="bg-red-500 hover:font-semibold text-white py-2 px-4 hover:border hover:border-red-500 border-transparent rounded"
                            onClick={confirmDelete}
                        >
                            Delete
                        </a>
                    )}

                </form>
            </div>
        )
    }
}

export default EditMovie;