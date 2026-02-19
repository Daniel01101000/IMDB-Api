import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CelebrityDetail.css";
import Cards from "../../Cards/Cards.jsx";

export default function CelebrityDetail() {
  const { id } = useParams();
  const [celebrity, setCelebrity] = useState(null);
  const [movies, setMovies] = useState([]);
  const [trailers, setTrailers] = useState({});
  const API_KEY = "52a1686bd91ac7378ffc4cd38a183b66";
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchCelebrity = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=es-ES`
        );
        const data = await res.json();
        setCelebrity(data);

        const moviesRes = await fetch(
          `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_KEY}&language=es-ES`
        );
        const moviesData = await moviesRes.json();
        setMovies(moviesData.cast || []);

        const trailersData = {};
        for (let movie of moviesData.cast.slice(0, 10)) {
          const videoRes = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=es-ES`
          );
          const videoData = await videoRes.json();
          trailersData[movie.id] = videoData.results.filter(
            (v) => v.site === "YouTube" && v.type === "Trailer"
          );
        }
        setTrailers(trailersData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCelebrity();
  }, [id]);

  if (!celebrity)
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );

  // calcular años
  let years = "";
  if (celebrity.birthday) {
    const birthYear = celebrity.birthday.split("-")[0];
    if (celebrity.deathday) {
      const deathYear = celebrity.deathday.split("-")[0];
      years = `${birthYear}–${deathYear}`;
    } else {
      years = `${birthYear}–${currentYear}`;
    }
  }

  return (
    <div className="celebrity-detail">

      <h1 className="celebrity-title">
        {celebrity.name}
        {years && <span className="celebrity-years"> ({years})</span>}
      </h1>

      <div className="celebrity-header">

        <img
          src={`https://image.tmdb.org/t/p/w300${celebrity.profile_path}`}
          alt={celebrity.name}
          className="celebrity-main-photo"
        />

        <div className="celebrity-info">

          <p><span className="info-label">Conocido/a por:</span> {celebrity.known_for_department}</p>

          <p><span className="info-label">Popularidad:</span> {celebrity.popularity.toFixed(1)}</p>

          <p><span className="info-label">Lugar de nacimiento:</span> {celebrity.place_of_birth || "No disponible"}</p>

          <p><span className="info-label">Fecha de nacimiento:</span> {celebrity.birthday}</p>

          {celebrity.deathday && (
            <p><span className="info-label">Fallecimiento:</span> {celebrity.deathday}</p>
          )}

        </div>
      </div>

      <h2 className="h2-known">
        <span className="l-yellow">l</span>Conocido/a por
      </h2>

      <Cards movies={movies} trailers={trailers} />

    </div>
  );
}