package main

import (
	"net/http"

	"fmt"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func (app *application) routes() http.Handler {
	// create a router mux
	mux := chi.NewRouter()

	mux.Use(middleware.Recoverer)
	mux.Use(app.enableCORS)

	mux.Get("/", app.Home)

	mux.Post("/authenticate", app.authenticate)
	mux.Get("/refresh", app.refreshToken)
	mux.Get("/logout", app.logout)

	mux.Get("/movies", app.AllMovies)
	mux.Get("/movies/{id}", app.GetMovie)

	mux.Get("/genres", app.AllGenres)
	mux.Get("/movies/genres/{id}", app.AllMoviesByGenre)
	mux.Get("/random", app.GetRandomMovie)
	mux.Get("/latest", app.GetLatestMovies)
	mux.Get("/search", app.SearchMovies)

	mux.Route("/user-list", func(mux chi.Router) {
		mux.Use(app.authRequired)
		mux.Get("/", app.GetUserList)
		mux.Post("/", app.AddToList)
		mux.Delete("/{movie_id}", app.RemoveFromList)
	})

	mux.Route("/admin", func(mux chi.Router) {
		mux.Use(app.authRequired)
		mux.Get("/movies", app.MovieCatalog)
		mux.Get("/movies/{id}", app.MovieForEdit)
		mux.Put("/movies/0", app.InsertMovie)
		mux.Patch("/movies/{id}", app.UpdateMovie)
		mux.Delete("/movies/{id}", app.DeleteMovie)
	})
	mux.Get("/videos/{name}", func(w http.ResponseWriter, r *http.Request) {
		name := chi.URLParam(r, "name")
		http.ServeFile(w, r, fmt.Sprintf("videos/%s", name))
	})

	return mux
}
