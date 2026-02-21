package dbrepo

import (
	"backend/internal/models"
	"context"
	"database/sql"
	"fmt"
	"time"
)

type PostgresDBRepo struct {
	DB *sql.DB
}

const dbTimeout = time.Second * 3

func (m *PostgresDBRepo) Connection() *sql.DB {
	return m.DB
}

func (m *PostgresDBRepo) AllMovies(genre ...int) ([]*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	where := ""
	if len(genre) > 0 {
		where = fmt.Sprintf("where id in (select movie_id from movies_genres where genre_id = %d)", genre[0])
	}
	query := fmt.Sprintf(`
		select
			id, title, release_date, runtime, description, coalesce(image, ''), coalesce(backdrop, ''),
			created_at, updated_at
		from
			movies %s
		order by
			title
	`, where)

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*models.Movie

	for rows.Next() {
		var movie models.Movie
		err := rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.ReleaseDate,
			&movie.RunTime,
			&movie.Description,
			&movie.Image,
			&movie.Backdrop,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		query = `select g.id, g.genre from movies_genres mg
		left join genres g on (mg.genre_id = g.id)
		where mg.movie_id = $1
		order by g.genre`

		rows, err := m.DB.QueryContext(ctx, query, movie.ID)
		if err != nil && err != sql.ErrNoRows {
			return nil, err
		}
		defer rows.Close()

		var genres []*models.Genre
		for rows.Next() {
			var g models.Genre
			err := rows.Scan(
				&g.ID,
				&g.Genre,
			)
			if err != nil {
				return nil, err
			}

			genres = append(genres, &g)
		}

		movie.Genres = genres

		movies = append(movies, &movie)
	}

	return movies, nil
}

func (m *PostgresDBRepo) RandomMovie() (*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id, title, release_date, runtime, 
		description, coalesce(image, ''), created_at, updated_at, coalesce(video_path, ''), coalesce(backdrop, '')
		from movies order by random() limit 1`

	row := m.DB.QueryRowContext(ctx, query)

	var movie models.Movie

	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.ReleaseDate,
		&movie.RunTime,
		&movie.Description,
		&movie.Image,
		&movie.CreatedAt,
		&movie.UpdatedAt,
		&movie.VideoPath,
		&movie.Backdrop,
	)

	if err != nil {
		return nil, err
	}

	// get genres, if any
	query = `select g.id, g.genre from movies_genres mg
		left join genres g on (mg.genre_id = g.id)
		where mg.movie_id = $1
		order by g.genre`

	rows, err := m.DB.QueryContext(ctx, query, movie.ID)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	defer rows.Close()

	var genres []*models.Genre
	for rows.Next() {
		var g models.Genre
		err := rows.Scan(
			&g.ID,
			&g.Genre,
		)
		if err != nil {
			return nil, err
		}

		genres = append(genres, &g)
	}

	movie.Genres = genres

	return &movie, err
}

func (m *PostgresDBRepo) OneMovie(id int) (*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id, title, release_date, runtime, 
		description, coalesce(image, ''), coalesce(backdrop, ''), created_at, updated_at, coalesce(video_path, '')
		from movies where id = $1`

	row := m.DB.QueryRowContext(ctx, query, id)

	var movie models.Movie

	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.ReleaseDate,
		&movie.RunTime,
		&movie.Description,
		&movie.Image,
		&movie.Backdrop,
		&movie.CreatedAt,
		&movie.UpdatedAt,
		&movie.VideoPath,
	)

	if err != nil {
		return nil, err
	}

	// get genres, if any
	query = `select g.id, g.genre from movies_genres mg
		left join genres g on (mg.genre_id = g.id)
		where mg.movie_id = $1
		order by g.genre`

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	defer rows.Close()

	var genres []*models.Genre
	for rows.Next() {
		var g models.Genre
		err := rows.Scan(
			&g.ID,
			&g.Genre,
		)
		if err != nil {
			return nil, err
		}

		genres = append(genres, &g)
	}

	movie.Genres = genres

	return &movie, err
}

func (m *PostgresDBRepo) OneMovieForEdit(id int) (*models.Movie, []*models.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id, title, release_date, runtime,
		description, coalesce(image, ''), created_at, updated_at, type
		from movies where id = $1`

	row := m.DB.QueryRowContext(ctx, query, id)

	var movie models.Movie

	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.ReleaseDate,
		&movie.RunTime,
		&movie.Description,
		&movie.Image,
		&movie.CreatedAt,
		&movie.UpdatedAt,
		&movie.Type,
	)

	if err != nil {
		return nil, nil, err
	}

	// get genres, if any
	query = `select g.id, g.genre from movies_genres mg
		left join genres g on (mg.genre_id = g.id)
		where mg.movie_id = $1
		order by g.genre`

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil && err != sql.ErrNoRows {
		return nil, nil, err
	}
	defer rows.Close()

	var genres []*models.Genre
	var genresArray []int

	for rows.Next() {
		var g models.Genre
		err := rows.Scan(
			&g.ID,
			&g.Genre,
		)
		if err != nil {
			return nil, nil, err
		}

		genres = append(genres, &g)
		genresArray = append(genresArray, g.ID)
	}

	movie.Genres = genres
	movie.GenresArray = genresArray

	var allGenres []*models.Genre

	query = "select id, genre from genres order by genre"
	gRows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, nil, err
	}
	defer gRows.Close()

	for gRows.Next() {
		var g models.Genre
		err := gRows.Scan(
			&g.ID,
			&g.Genre,
		)
		if err != nil {
			return nil, nil, err
		}

		allGenres = append(allGenres, &g)
	}

	return &movie, allGenres, err
}

func (m *PostgresDBRepo) GetUserByEmail(email string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id, email, first_name, last_name, password,
			created_at, updated_at from users where email = $1`

	var user models.User
	row := m.DB.QueryRowContext(ctx, query, email)

	err := row.Scan(
		&user.ID,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (m *PostgresDBRepo) GetUserByID(id int) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id, email, first_name, last_name, password,
			created_at, updated_at from users where id = $1`

	var user models.User
	row := m.DB.QueryRowContext(ctx, query, id)

	err := row.Scan(
		&user.ID,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (m *PostgresDBRepo) AllGenres() ([]*models.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id, genre, created_at, updated_at from genres order by genre`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var genres []*models.Genre

	for rows.Next() {
		var g models.Genre
		err := rows.Scan(
			&g.ID,
			&g.Genre,
			&g.CreatedAt,
			&g.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		genres = append(genres, &g)
	}

	return genres, nil
}

func (m *PostgresDBRepo) InsertMovie(movie models.Movie) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	stmt := `insert into movies (title, description, release_date, runtime, created_at, updated_at, image, type, backdrop)
			values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id`

	var newID int

	err := m.DB.QueryRowContext(ctx, stmt,
		movie.Title,
		movie.Description,
		movie.ReleaseDate,
		movie.RunTime,
		movie.CreatedAt,
		movie.UpdatedAt,
		movie.Image,
		movie.Type,
		movie.Backdrop,
	).Scan(&newID)

	if err != nil {
		return 0, err
	}

	return newID, nil
}

func (m *PostgresDBRepo) UpdateMovieGenres(id int, genreIDs []int) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	for _, n := range genreIDs {
		println(n)
	}

	stmt := `delete from movies_genres where movie_id = $1`

	_, err := m.DB.ExecContext(ctx, stmt, id)
	if err != nil {
		return err
	}

	for _, n := range genreIDs {
		println(n)
		stmt := `insert into movies_genres (movie_id, genre_id) values ($1, $2)`
		_, err := m.DB.ExecContext(ctx, stmt, id, n)
		if err != nil {
			return err
		}
	}

	return nil
}

func (m *PostgresDBRepo) UpdateMovie(movie models.Movie) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	stmt := `update movies set title = $1, description = $2, release_date = $3, runtime = $4, updated_at = $5, image = $6, type = $7 
			where id = $8`

	_, err := m.DB.ExecContext(ctx, stmt,
		movie.Title,
		movie.Description,
		movie.ReleaseDate,
		movie.RunTime,
		movie.UpdatedAt,
		movie.Image,
		movie.Type,
		movie.ID,
	)

	if err != nil {
		return err
	}

	return nil
}

func (m *PostgresDBRepo) DeleteMovie(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	stmt := `delete from movies where id = $1`

	_, err := m.DB.ExecContext(ctx, stmt, id)

	if err != nil {
		return err
	}

	return nil
}

func (m *PostgresDBRepo) LatestMovies(count int) ([]*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := fmt.Sprintf(`
		select
			id, title, release_date, runtime, description, coalesce(image, ''), coalesce(backdrop, ''),
			created_at, updated_at
		from
			movies
		order by
			created_at desc
		limit %d
	`, count)

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*models.Movie

	for rows.Next() {
		var movie models.Movie
		err := rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.ReleaseDate,
			&movie.RunTime,
			&movie.Description,
			&movie.Image,
			&movie.Backdrop,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		query = `select g.id, g.genre from movies_genres mg
				left join genres g on (mg.genre_id = g.id)
				where mg.movie_id = $1
				order by g.genre`

		rows, err := m.DB.QueryContext(ctx, query, movie.ID)
		if err != nil && err != sql.ErrNoRows {
			return nil, err
		}
		defer rows.Close()

		var genres []*models.Genre
		for rows.Next() {
			var g models.Genre
			err := rows.Scan(
				&g.ID,
				&g.Genre,
			)
			if err != nil {
				return nil, err
			}

			genres = append(genres, &g)
		}

		movie.Genres = genres

		movies = append(movies, &movie)
	}

	return movies, nil

}

func (m *PostgresDBRepo) GetUserList(userID int) ([]*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		select m.id, m.title, m.release_date, m.runtime, m.description, 
			coalesce(m.image, ''), coalesce(m.backdrop, ''), m.created_at, m.updated_at
		from movies m
		join user_movie_list u on m.id = u.movie_id
		where u.user_id = $1
		order by u.created_at desc
	`

	rows, err := m.DB.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*models.Movie
	for rows.Next() {
		var movie models.Movie
		err := rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.ReleaseDate,
			&movie.RunTime,
			&movie.Description,
			&movie.Image,
			&movie.Backdrop,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		genresQuery := `select g.id, g.genre from movies_genres mg
			left join genres g on (mg.genre_id = g.id)
			where mg.movie_id = $1 order by g.genre`

		genreRows, err := m.DB.QueryContext(ctx, genresQuery, movie.ID)
		if err != nil && err != sql.ErrNoRows {
			return nil, err
		}
		defer genreRows.Close()

		var genres []*models.Genre
		for genreRows.Next() {
			var g models.Genre
			err := genreRows.Scan(&g.ID, &g.Genre)
			if err != nil {
				return nil, err
			}
			genres = append(genres, &g)
		}
		movie.Genres = genres

		movies = append(movies, &movie)
	}

	return movies, nil
}

func (m *PostgresDBRepo) AddToList(userID int, movieID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	_, err := m.DB.ExecContext(ctx,
		`INSERT INTO user_movie_list (user_id, movie_id) VALUES ($1, $2) 
		 ON CONFLICT (user_id, movie_id) DO NOTHING`, userID, movieID)
	return err
}

func (m *PostgresDBRepo) RemoveFromList(userID int, movieID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	_, err := m.DB.ExecContext(ctx,
		`DELETE FROM user_movie_list WHERE user_id = $1 AND movie_id = $2`, userID, movieID)
	return err
}

func (m *PostgresDBRepo) SearchMovies(search string) ([]*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := fmt.Sprintf(`
		select
			id, title, release_date, runtime, description, coalesce(image, ''), coalesce(backdrop, ''),
			created_at, updated_at
		from
			movies
		where
			title ilike '%%%s%%'
		order by
			title
	`, search)

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*models.Movie

	for rows.Next() {
		var movie models.Movie
		err := rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.ReleaseDate,
			&movie.RunTime,
			&movie.Description,
			&movie.Image,
			&movie.Backdrop,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		query = `select g.id, g.genre from movies_genres mg
				left join genres g on (mg.genre_id = g.id)
				where mg.movie_id = $1
				order by g.genre`

		rows, err := m.DB.QueryContext(ctx, query, movie.ID)
		if err != nil && err != sql.ErrNoRows {
			return nil, err
		}
		defer rows.Close()

		var genres []*models.Genre
		for rows.Next() {
			var g models.Genre
			err := rows.Scan(
				&g.ID,
				&g.Genre,
			)
			if err != nil {
				return nil, err
			}

			genres = append(genres, &g)
		}

		movie.Genres = genres

		movies = append(movies, &movie)
	}

	return movies, nil
}
