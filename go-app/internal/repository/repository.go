package repository

import (
	"backend/internal/models"
	"database/sql"
)

type DatabaseRepo interface {
	Connection() *sql.DB
	AllMovies(genre ...int) ([]*models.Movie, error)
	RandomMovie() (*models.Movie, error)
	GetUserByEmail(email string) (*models.User, error)
	GetUserByID(id int) (*models.User, error)
	OneMovieForEdit(id int) (*models.Movie, []*models.Genre, error)
	OneMovie(id int) (*models.Movie, error)
	AllGenres() ([]*models.Genre, error)
	InsertMovie(movie models.Movie) (int, error)
	UpdateMovieGenres(id int, genresID []int) error
	UpdateMovie(movie models.Movie) error
	DeleteMovie(id int) error
	LatestMovies(count int) ([]*models.Movie, error)
	SearchMovies(search string) ([]*models.Movie, error)
	GetUserList(userID int) ([]*models.Movie, error)
	AddToList(userID int, movieID int) error
	RemoveFromList(userID int, movieID int) error
}
