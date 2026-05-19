export default async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  const query = request.query.q;

  if (!query || query.trim().length < 3) {
    return response.status(400).json({
      success: false,
      message: "Search query must be at least 3 characters."
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
    const omdbResponse = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`
    );

    const data = await omdbResponse.json();

    if (data.Response === "False" || !data.Search) {
      return response.status(200).json({
        success: true,
        movies: []
      });
    }

    const movies = data.Search.map(function (movie) {
      return {
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Type: movie.Type,
        Poster: movie.Poster
      };
    });

    return response.status(200).json({
      success: true,
      movies: movies
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Failed to fetch movie suggestions."
    });
  }
}