import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Celebrities.css";

export default function Celebrities_Route() {
  const [celebrities, setCelebrities] = useState([]);
  const API_KEY = "52a1686bd91ac7378ffc4cd38a183b66";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCelebrities = async () => {
      try {
        let allCelebrities = [];

        // Obtener las primeras 3 páginas
        for (let page = 1; page <= 5; page++) {
          const res = await fetch(
            `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=es-ES&page=${page}`
          );
          const data = await res.json();
          allCelebrities = [...allCelebrities, ...data.results];
        }

        setCelebrities(allCelebrities);
      } catch (error) {
        console.error("Error fetching celebrities:", error);
      }
    };

    fetchCelebrities();
  }, []);

  const goToCelebrity = (celebrityId) => {
    navigate(`/celebrity/${celebrityId}`);
  };

  return (
    <div className="celebrities-section">
      <h2 className="section-title-celebrities">Celebridades más Populares</h2>
      <div className="celebrities-grid">
        {celebrities.map((celebrity) => (
          <div
            key={celebrity.id}
            className="celebrity-card"
            onClick={() => goToCelebrity(celebrity.id)}
          >
            {celebrity.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${celebrity.profile_path}`}
                alt={celebrity.name}
                className="celebrity-photo"
              />
            ) : (
              <div className="no-photo">Sin foto</div>
            )}
            <h3 className="celebrity-name">{celebrity.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}