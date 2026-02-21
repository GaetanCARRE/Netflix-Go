# Netflix Clone - Full Stack Streaming Platform

A Netflix-like streaming platform clone built with **Go** (backend) and **React** (frontend). This project demonstrates a complete full-stack application with user authentication, video streaming, content management, and admin capabilities.

<img src="screenshots/demo.gif" alt="Demo" width="100%">

---

## Screenshots

<img src="screenshots/home.png" alt="Home Page" width="100%">

*Home Page*

<img src="screenshots/movie_modal.png" alt="Movie Info Modal" width="100%">

*Movie Info Modal*

<img src="screenshots/admin.png" alt="Admin Panel - Catalog" width="100%">

*Admin Panel - Catalog*

<img src="screenshots/movies.png" alt="Movies Listing" width="100%">

*Movies Listing*

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start with Docker](#quick-start-with-docker)
  - [Manual Installation](#manual-installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)

---

## Overview

This project is a showcase application demonstrating modern web development practices:

- **Full-stack JavaScript & Go implementation**
- **JWT-based authentication** with refresh tokens
- **Video streaming** with progress tracking
- **Admin panel** for content management
- **TMDB API integration** for movie posters
- **Docker-ready** deployment

---

## Features

### User Features

| Feature | Description |
|---------|-------------|
| **Browse Content** | Browse movies and TV series with Netflix-style UI |
| **Genre Filtering** | Filter content by 13 different genres |
| **Search** | Search movies and series by title |
| **Video Playback** | Stream video content with built-in player |
| **Progress Tracking** | Resume playback from where you left off |
| **Watchlist (My List)** | Add/remove movies to your personal list |
| **Responsive Design** | Works on desktop and mobile devices |

### Authentication

| Feature | Description |
|---------|-------------|
| **User Registration** | Create new user accounts |
| **Login/Logout** | Secure authentication flow |
| **JWT Tokens** | Access tokens (15 min) + Refresh tokens (24h) |
| **Auto-refresh** | Frontend automatically refreshes tokens |

### Admin Features

| Feature | Description |
|---------|-------------|
| **Content Management** | Add, edit, and delete movies/series |
| **Genre Management** | Assign multiple genres to content |
| **TMDB Integration** | Auto-fetch movie posters from TMDB |
| **Catalog Overview** | View all content with filtering options |

---

## Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **Go 1.21** | Primary backend language |
| **Chi Router** | HTTP routing |
| **pgx** | PostgreSQL driver |
| **golang-jwt** | JWT authentication |
| **bcrypt** | Password hashing |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **React Router v6** | Client-side routing |
| **Tailwind CSS** | Styling |
| **React Player** | Video playback |
| **Headless UI** | Accessible components |
| **Lucide React** | Icons |

### Database & Infrastructure

| Technology | Purpose |
|------------|---------|
| **PostgreSQL 14** | Primary database |
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |

### External APIs

| API | Purpose |
|-----|---------|
| **TMDB API** | Movie poster and backdrop images |

---

## Architecture

```mermaid
graph TB
    subgraph "Frontend (React)"
        UI[User Interface]
        Context[Auth Context]
        Router[React Router]
    end

    subgraph "Backend (Go)"
        API[REST API]
        Auth[JWT Middleware]
        Handlers[HTTP Handlers]
        Repo[Repository Layer]
    end

    subgraph "Database"
        PG[(PostgreSQL)]
    end

    subgraph "External"
        TMDB[TMDB API]
    end

    UI --> Router
    Router --> Context
    Context --> API
    API --> Auth
    Auth --> Handlers
    Handlers --> Repo
    Repo --> PG
    Handlers --> TMDB
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database

    U->>F: Enter credentials
    F->>B: POST /authenticate
    B->>D: Validate credentials
    D-->>B: User data
    B->>B: Generate JWT tokens
    B-->>F: Access token + Refresh cookie
    F->>F: Store token in memory
    
    Note over F,B: Subsequent requests include Bearer token
    
    F->>B: GET /movies (Bearer token)
    B->>B: Validate JWT
    B-->>F: Movie data
```

---

## Getting Started

### Prerequisites

- **Docker** and **Docker Compose** (recommended)
- Or manually:
  - **Go 1.21+**
  - **Node.js 18+**
  - **PostgreSQL 14+**

### Quick Start with Docker

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/netflix-go.git
cd netflix-go
```

2. **Create environment file**

```bash
cp go-app/.env.example go-app/.env
```

Edit `.env` with your configuration:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=netflix
DATABASE_URL=postgres://postgres:postgres@postgres:5432/netflix?sslmode=disable
JWT_SECRET=your-secret-key
JWT_ISSUER=netflix.example.com
JWT_AUDIENCE=netflix.example.com
TMDB_API_KEY=your-tmdb-api-key
```

3. **Start all services**

```bash
docker-compose up -d
```

4. **Access the application**

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8080](http://localhost:8080)

5. **Seed the database**

```bash
docker-compose exec go-app sh -c "psql -h postgres -U postgres -d netflix -f /app/sql/create_tables.sql"
```

### Manual Installation

#### 1. Database Setup

```bash
# Start PostgreSQL
docker run --name netflix-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=netflix -p 5432:5432 -d postgres:14

# Initialize schema
psql -h localhost -U postgres -d netflix -f go-app/sql/create_tables.sql
```

#### 2. Backend Setup

```bash
cd go-app

# Install dependencies
go mod download

# Run the server
go run ./cmd/api \
  -dsn="postgres://postgres:postgres@localhost:5432/netflix?sslmode=disable" \
  -jwt-secret="your-secret-key" \
  -jwt-issuer="netflix.example.com" \
  -jwt-audience="netflix.example.com" \
  -api-key="your-tmdb-api-key"
```

#### 3. Frontend Setup

```bash
cd react-app

# Install dependencies
npm install

# Start development server
npm start
```

---

## Configuration

### Backend Environment Variables / Flags

| Flag | Description | Default |
|------|-------------|---------|
| `-dsn` | PostgreSQL connection string | Required |
| `-jwt-secret` | Secret key for JWT signing | Required |
| `-jwt-issuer` | JWT issuer claim | `example.com` |
| `-jwt-audience` | JWT audience claim | `example.com` |
| `-cookie-domain` | Cookie domain | `localhost` |
| `-domain` | Application domain | `localhost` |
| `-api-key` | TMDB API key | `""` |
| `-video-storage-path` | Path to video files | `./videos` |

### Frontend Configuration

The frontend proxies API requests to the backend. Configure in `react-app/package.json`:

```json
{
  "proxy": "http://localhost:8080"
}
```

---

## API Documentation

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/movies` | Get all movies |
| `GET` | `/movies/{id}` | Get single movie |
| `GET` | `/movies/genres/{id}` | Get movies by genre |
| `GET` | `/genres` | Get all genres |
| `GET` | `/random` | Get random movie |
| `GET` | `/latest?count=N` | Get latest movies |
| `GET` | `/search?q=query` | Search movies |
| `GET` | `/videos/{path}` | Serve video files |

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/authenticate` | Login (returns JWT) |
| `GET` | `/refresh` | Refresh access token |
| `GET` | `/logout` | Logout (clear cookie) |

### Protected Endpoints (Requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/me` | Get current user |
| `GET` | `/user-list` | Get user watchlist |
| `POST` | `/user-list` | Add to watchlist |
| `DELETE` | `/user-list/{id}` | Remove from watchlist |
| `GET` | `/progress/{id}` | Get video progress |
| `POST` | `/progress/{id}` | Save video progress |

### Admin Endpoints (Requires Admin Role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/movies` | Get all movies (admin) |
| `GET` | `/admin/movies/{id}` | Get movie for editing |
| `PUT` | `/admin/movies/0` | Create new movie |
| `PATCH` | `/admin/movies/{id}` | Update movie |
| `DELETE` | `/admin/movies/{id}` | Delete movie |

---

## Database Schema

```mermaid
erDiagram
    USERS ||--o{ USER_MOVIE_LIST : has
    USERS ||--o{ USER_MOVIE_PROGRESS : has
    MOVIES ||--o{ MOVIES_GENRES : has
    GENRES ||--o{ MOVIES_GENRES : has
    MOVIES ||--o{ USER_MOVIE_LIST : in
    MOVIES ||--o{ USER_MOVIE_PROGRESS : in

    USERS {
        int id PK
        string first_name
        string last_name
        string email
        string password
        boolean is_admin
        timestamp created_at
        timestamp updated_at
    }

    MOVIES {
        int id PK
        string title
        string director
        date release_date
        int runtime
        string mpaa_rating
        text description
        string image
        string backdrop
        string video_path
        string type
        timestamp created_at
        timestamp updated_at
    }

    GENRES {
        int id PK
        string genre
        timestamp created_at
        timestamp updated_at
    }

    MOVIES_GENRES {
        int id PK
        int movie_id FK
        int genre_id FK
    }

    USER_MOVIE_LIST {
        int user_id FK
        int movie_id FK
        timestamp created_at
    }

    USER_MOVIE_PROGRESS {
        int user_id FK
        int movie_id FK
        int progress_seconds
        int total_seconds
        timestamp updated_at
    }
```

---

## Project Structure

```
netflix-go/
├── docker-compose.yml          # Root orchestration
│
├── go-app/                     # Go Backend
│   ├── cmd/api/
│   │   ├── main.go            # Entry point
│   │   ├── routes.go          # Route definitions
│   │   ├── handlers.go        # HTTP handlers
│   │   ├── auth.go            # JWT logic
│   │   ├── middleware.go      # CORS & Auth middleware
│   │   ├── db.go              # DB connection
│   │   └── utils.go           # Utilities
│   ├── internal/
│   │   ├── models/            # Data models
│   │   │   ├── User.go
│   │   │   └── Movie.go
│   │   └── repository/        # Data access layer
│   │       ├── repository.go
│   │       └── dbrepo/
│   │           └── postgres_dbrepo.go
│   ├── sql/
│   │   └── create_tables.sql  # Schema & seed data
│   ├── videos/                 # Video storage
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── go.mod
│
└── react-app/                  # React Frontend
    ├── src/
    │   ├── App.js             # Root component
    │   ├── index.js           # Router config
    │   ├── components/
    │   │   ├── Home.js        # Homepage
    │   │   ├── Login.js       # Auth page
    │   │   ├── Header.js      # Navigation
    │   │   ├── Movies.js      # Movies listing
    │   │   ├── Movie.js       # Movie detail
    │   │   ├── Series.js      # Series listing
    │   │   ├── Genres.js      # Genres page
    │   │   ├── Genre.js       # Genre filter
    │   │   ├── Search.js      # Search results
    │   │   ├── MyList.js      # Watchlist
    │   │   ├── VideoPlayer.js # Video player
    │   │   ├── MovieInfo.js   # Movie modal
    │   │   ├── Admin.js       # Admin panel
    │   │   ├── ManageCatalog.js
    │   │   ├── EditMovie.js   # Movie form
    │   │   └── form/          # Form components
    │   └── assets/
    ├── public/
    ├── package.json
    └── tailwind.config.js
```


## Getting a TMDB API Key

1. Go to [TMDB](https://www.themoviedb.org/)
2. Create a free account
3. Navigate to Settings → API
4. Request an API key
5. Add it to your configuration

---

## License

This project is for educational and portfolio purposes.

---

## Acknowledgments

- Movie data and images from [TMDB](https://www.themoviedb.org/)
- UI inspired by Netflix
