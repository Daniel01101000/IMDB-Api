import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header.jsx";
import Cards from "./components/Cards/Cards.jsx";
import Celebrities from "./components/Celebrities/Celebrities-Image/Celebrities.jsx";
import CelebrityDetail from "./components/Celebrities/CelebrityDetail/CelebrityDetail.jsx";
import Register from "./components/Auth/Register/Register.jsx";

import Celebrities_Route from "./Routes/Celebrities/Celebrities.jsx";
import TopRated_Route from "./Routes/Top-Rated/Top-Rated.jsx";
import Favorites_Route from "./Routes/Favorites/Favorites.jsx";

// 🔹 Importar páginas de autenticación
import Login from "./components/Auth/Login.jsx";
import Dashboard from "./components/Auth/Dashboard.jsx";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [trailers, setTrailers] = useState({});
  const API_KEY = "52a1686bd91ac7378ffc4cd38a183b66";

  // Función para obtener trailers de YouTube
  const fetchTrailers = async (movieId, movieTitle) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=es-ES`
      );
      const data = await res.json();
      const youtubeTrailers = data.results.filter(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );

      if (youtubeTrailers[0]) return [youtubeTrailers[0]];
      return [
        {
          id: "youtube-search",
          key: `https://www.youtube.com/results?search_query=${encodeURIComponent(
            movieTitle + " trailer"
          )}`,
          site: "YouTube",
          type: "Trailer",
        },
      ];
    } catch (error) {
      console.error(error);
      return [
        {
          id: "youtube-search",
          key: `https://www.youtube.com/results?search_query=${encodeURIComponent(
            movieTitle + " trailer"
          )}`,
          site: "YouTube",
          type: "Trailer",
        },
      ];
    }
  };

  // Fetch de películas populares al cargar la app
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`
        );
        const data = await res.json();
        setFeatured(data.results);

        const trailersObj = {};
        await Promise.all(
          data.results.map(async (movie) => {
            const movieTrailers = await fetchTrailers(movie.id, movie.title);
            if (movieTrailers.length > 0) trailersObj[movie.id] = movieTrailers;
          })
        );
        setTrailers(trailersObj);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFeatured();
  }, []);

  const moviesToShow = movies.length > 0 ? movies : featured;

  return (
    <Router>
      <div className="app-container">
        <Header
          setMovies={setMovies}
          setTrailers={setTrailers}
          fetchTrailers={fetchTrailers}
        />

        <Routes>
          {/* Inicio: populares o búsqueda */}
          <Route
            path="/"
            element={
              <>
                <Celebrities />
                <h2 className="section-title">
                  {movies.length > 0 ? "Resultados de la búsqueda" : "Destacado hoy"}
                </h2>
                <Cards movies={moviesToShow} trailers={trailers} />
              </>
            }
          />

          {/* Populares */}
          <Route path="/celebridades" element={<Celebrities_Route />} />

          {/* Top Rated */}
          <Route path="/top-rated" element={<TopRated_Route />} />

          {/* Favoritos */}
          <Route path="/favoritos" element={<Favorites_Route />} />

          {/* Detalle de celebridad */}
          <Route path="/celebrity/:id" element={<CelebrityDetail />} />

          {/* 🔹 Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}