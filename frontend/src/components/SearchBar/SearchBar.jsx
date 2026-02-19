import { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ setMovies, setTrailers }) {
  const [query, setQuery] = useState("");
  const API_KEY = "52a1686bd91ac7378ffc4cd38a183b66";

  const searchMovies = async () => {
    if (!query) return;
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setMovies(data.results);

      const trailersObj = {};
      await Promise.all(
        data.results.map(async (movie) => {
          const trailers = await fetchTrailers(movie.id);
          if (trailers.length > 0) {
            trailersObj[movie.id] = trailers[0]; // primer trailer
          }
        })
      );
      setTrailers(trailersObj);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar película..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
        onKeyDown={(e) => e.key === "Enter" && searchMovies()}
      />
      <button onClick={searchMovies} className="search-button">
        Buscar
      </button>
    </div>
  );
}