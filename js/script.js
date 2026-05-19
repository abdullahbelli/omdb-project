const API_KEY = "aee49c3f";

const searchForm = document.getElementById("searchForm");
const movieInput = document.getElementById("movieInput");
const message = document.getElementById("message");
const result = document.getElementById("result");

const moviePoster = document.getElementById("moviePoster");
const movieTitle = document.getElementById("movieTitle");
const movieMeta = document.getElementById("movieMeta");
const movieRating = document.getElementById("movieRating");
const moviePlot = document.getElementById("moviePlot");
const movieGenre = document.getElementById("movieGenre");
const movieDirector = document.getElementById("movieDirector");
const movieActors = document.getElementById("movieActors");
const movieLanguage = document.getElementById("movieLanguage");

const DEFAULT_POSTER =
  "https://placehold.co/600x900/111827/ffffff?text=No+Poster";

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const movieName = movieInput.value.trim();

  if (movieName === "") {
    showMessage("Please enter a movie name.");
    hideResult();
    return;
  }

  searchMovie(movieName);
});

async function searchMovie(movieName) {
  showMessage("Searching movie...");
  hideResult();

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${API_KEY}`
    );

    const data = await response.json();

    if (data.Response === "False") {
      showMessage(data.Error || "Movie not found.");
      hideResult();
      return;
    }

    showMovie(data);
    localStorage.setItem("lastMovieSearch", movieName);
    showMessage("");
  } catch (error) {
    showMessage("Something went wrong. Please try again later.");
    hideResult();
  }
}

function showMovie(movie) {
  moviePoster.src =
    movie.Poster && movie.Poster !== "N/A" ? movie.Poster : DEFAULT_POSTER;

  moviePoster.alt = `${movie.Title} poster`;

  movieTitle.textContent = movie.Title || "Unknown Title";

  movieMeta.textContent = `${movie.Year || "N/A"} • ${movie.Runtime || "N/A"} • ${
    movie.Type || "N/A"
  }`;

  movieRating.textContent =
    movie.imdbRating && movie.imdbRating !== "N/A"
      ? `IMDb ${movie.imdbRating}`
      : "No Rating";

  moviePlot.textContent =
    movie.Plot && movie.Plot !== "N/A"
      ? movie.Plot
      : "No plot information available.";

  movieGenre.textContent = movie.Genre || "N/A";
  movieDirector.textContent = movie.Director || "N/A";
  movieActors.textContent = movie.Actors || "N/A";
  movieLanguage.textContent = movie.Language || "N/A";

  result.classList.remove("hidden");
}

function showMessage(text) {
  message.textContent = text;
}

function hideResult() {
  result.classList.add("hidden");
}

window.addEventListener("load", function () {
  const lastMovie = localStorage.getItem("lastMovieSearch");

  if (lastMovie) {
    movieInput.value = lastMovie;
    searchMovie(lastMovie);
  }
});