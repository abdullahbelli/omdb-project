export default async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  const title = request.query.title;
  const imdbID = request.query.id;

  if (!title && !imdbID) {
    return response.status(400).json({
      success: false,
      message: "Movie title or IMDb ID is required."
    });
  }

  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    return response.status(500).json({
      success: false,
      message: "OMDB API key is not configured."
    });
  }

  try {
    const queryParam = imdbID
      ? `i=${encodeURIComponent(imdbID)}`
      : `t=${encodeURIComponent(title)}`;

    const omdbResponse = await fetch(
      `https://www.omdbapi.com/?${queryParam}&apikey=${apiKey}`
    );

    const data = await omdbResponse.json();

    if (data.Response === "False") {
      return response.status(404).json({
        success: false,
        message: data.Error || "Movie not found."
      });
    }

    const movie = {
      Title: data.Title,
      Year: data.Year,
      Runtime: data.Runtime,
      Type: data.Type,
      Genre: data.Genre,
      Director: data.Director,
      Actors: data.Actors,
      Language: data.Language,
      Plot: data.Plot,
      Poster: data.Poster,
      imdbRating: data.imdbRating
    };

    return response.status(200).json({
      success: true,
      movie: movie
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Failed to fetch movie details."
    });
  }
}