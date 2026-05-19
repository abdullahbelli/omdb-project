const API_KEY = "aee49c3f";

const searchForm = document.getElementById("searchForm");
const movieInput = document.getElementById("movieInput");
const message = document.getElementById("message");
const result = document.getElementById("result");
const suggestions = document.getElementById("suggestions");

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
  "https://placehold.co/300x450/e5e7eb/555555?text=No+Poster";

let suggestionTimer;
let lastSuggestionQuery = "";

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const movieName = movieInput.value.trim();

  if (movieName === "") {
    showMessage("Please enter a movie name.");
    hideResult();
    hideSuggestions();
    return;
  }

  hideSuggestions();
  searchMovie(movieName);
});

movieInput.addEventListener("input", function () {
  const query = movieInput.value.trim();

  clearTimeout(suggestionTimer);

  if (query.length < 3) {
    hideSuggestions();
    return;
  }

  suggestionTimer = setTimeout(function () {
    getSuggestions(query);
  }, 350);
});

document.addEventListener("click", function (event) {
  if (!event.target.closest(".input-area")) {
    hideSuggestions();
  }
});

async function getSuggestions(query) {
  lastSuggestionQuery = query;

  try {
    const movies = await fetchSuggestions(query);

    if (query !== lastSuggestionQuery) {
      return;
    }

    if (movies.length === 0) {
      showNoSuggestions();
      return;
    }

    showSuggestions(movies, query);
  } catch (error) {
    showNoSuggestions();
  }
}

async function fetchSuggestions(query) {
  const response = await fetch(
    `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`
  );

  const data = await response.json();

  if (data.Response === "False" || !data.Search) {
    return [];
  }

  return prepareSuggestions(data.Search, query);
}

function prepareSuggestions(movies, query) {
  const queryText = query.toLowerCase();

  const uniqueMovies = [];

  movies.forEach(function (movie) {
    const alreadyExists = uniqueMovies.some(function (item) {
      return item.imdbID === movie.imdbID;
    });

    if (!alreadyExists) {
      uniqueMovies.push(movie);
    }
  });

  uniqueMovies.sort(function (a, b) {
    const titleA = a.Title.toLowerCase();
    const titleB = b.Title.toLowerCase();

    const aStartsWithQuery = titleA.startsWith(queryText);
    const bStartsWithQuery = titleB.startsWith(queryText);

    if (aStartsWithQuery && !bStartsWithQuery) return -1;
    if (!aStartsWithQuery && bStartsWithQuery) return 1;

    return titleA.localeCompare(titleB);
  });

  return uniqueMovies.slice(0, 8);
}

function showSuggestions(movies, query) {
  suggestions.innerHTML = "";

  movies.forEach(function (movie) {
    const item = document.createElement("div");
    item.className = "suggestion-item";

    const poster =
      movie.Poster && movie.Poster !== "N/A" ? movie.Poster : DEFAULT_POSTER;

    item.innerHTML = `
      <img src="${poster}" alt="${movie.Title}">
      <div class="suggestion-text">
        <strong>${highlightMatch(movie.Title, query)}</strong>
        <span>${movie.Year} • ${movie.Type}</span>
      </div>
    `;

    item.addEventListener("click", function () {
      movieInput.value = movie.Title;
      hideSuggestions();
      searchMovieById(movie.imdbID);
    });

    suggestions.appendChild(item);
  });

  suggestions.classList.remove("hidden");
}

function showNoSuggestions() {
  suggestions.innerHTML = `
    <div class="suggestion-empty">
      No matching suggestions. Press Search to try this title.
    </div>
  `;

  suggestions.classList.remove("hidden");
}

function highlightMatch(title, query) {
  const lowerTitle = title.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerTitle.indexOf(lowerQuery);

  if (index === -1) {
    return title;
  }

  const before = title.slice(0, index);
  const match = title.slice(index, index + query.length);
  const after = title.slice(index + query.length);

  return `${before}<mark>${match}</mark>${after}`;
}

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

async function searchMovieById(imdbID) {
  showMessage("Searching movie...");
  hideResult();

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`
    );

    const data = await response.json();

    if (data.Response === "False") {
      showMessage(data.Error || "Movie not found.");
      hideResult();
      return;
    }

    showMovie(data);
    localStorage.setItem("lastMovieSearch", data.Title);
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

function hideSuggestions() {
  suggestions.classList.add("hidden");
  suggestions.innerHTML = "";
}

window.addEventListener("load", function () {
  const lastMovie = localStorage.getItem("lastMovieSearch");

  if (lastMovie) {
    movieInput.value = lastMovie;
    searchMovie(lastMovie);
  }
});