# OMDB Movie Search Project

This is a movie search web application built with HTML, CSS and JavaScript. The application uses the OMDB API through a backend proxy created with Vercel Serverless Functions.

## Live Demo

https://omdb-project-three.vercel.app/

## Features

- Search movies by title
- Show live movie suggestions while typing
- Display movie poster, title, year, runtime and type
- Show IMDb rating, genre, director, actors, language and plot
- Error handling for empty input, missing results and API errors
- Loading message while searching
- Saves the last searched movie using localStorage
- Responsive design for desktop and mobile devices
- Backend proxy for OMDB API requests

## Technologies Used

- HTML
- CSS
- JavaScript
- OMDB API
- Vercel Serverless Functions

## Backend Proxy

This project uses Vercel Serverless Functions as a backend proxy for the OMDB API.

The frontend does not call the OMDB API directly. Instead, it sends requests to internal API routes:

- `/api/search?q=movieName`
- `/api/movie?title=movieName`
- `/api/movie?id=imdbID`

The proxy handles requests to the OMDB API and returns clean JSON data to the frontend.

The OMDB API key is stored as a Vercel environment variable:

```text
OMDB_API_KEY
```

Because of this structure, the API key is not exposed directly in the frontend JavaScript code.

## How to Use

1. Enter a movie name in the search input.
2. Select a movie from the suggestion list or click the Search button.
3. Movie details will be displayed on the page.
4. Refreshing the page keeps the last searched movie by using localStorage.

## API Routes

### Search Movies

```text
/api/search?q=batman
```

Returns a list of movie suggestions.

### Get Movie Details by Title

```text
/api/movie?title=batman
```

Returns detailed movie information by title.

### Get Movie Details by IMDb ID

```text
/api/movie?id=tt0096895
```

Returns detailed movie information by IMDb ID.

## Project Structure

```text
omdb-project/
├── api/
│   ├── movie.js
│   └── search.js
├── assets/
├── css/
│   └── style.css
├── js/
│   └── script.js
├── index.html
└── README.md
```

## Project Purpose

This project was created as part of a frontend development application task. The goal is to demonstrate API usage, DOM manipulation, responsive design, error handling, simple state persistence with localStorage and backend proxy usage with a clean project structure.
