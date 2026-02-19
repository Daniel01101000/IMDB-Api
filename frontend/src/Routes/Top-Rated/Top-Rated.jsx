import { useEffect, useState } from "react";
import Cards from "../../components/Cards/Cards";

export default function TopRated_Route() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const API_KEY = "52a1686bd91ac7378ffc4cd38a183b66";

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=es-MX&page=1`
        );
        const data = await res.json();
        console.log("Películas top-rated desde API:", data.results);
        setMovies(data.results);
      } catch (error) {
        console.error("Error al traer top-rated:", error);
      }
    };

    fetchTopRated();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("favoritesData");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  if (!movies || movies.length === 0) {
    return <p>No hay películas para mostrar.</p>;
  }

  return <Cards movies={movies} favorites={favorites} />;
}