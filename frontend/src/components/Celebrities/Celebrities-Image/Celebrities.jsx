import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Celebrities.css";

export default function Celebrities() {
  const [celebrities, setCelebrities] = useState([]);
  const API_KEY = "52a1686bd91ac7378ffc4cd38a183b66";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCelebrities = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=es-ES&page=1`
        );
        const data = await res.json();
        setCelebrities(data.results);
      } catch (error) {
        console.error("Error fetching celebrities:", error);
      }
    };

    fetchCelebrities();
  }, []);

  const goToCelebrity = (celebrityId) => {
    navigate(`/celebrity/${celebrityId}`); // navega a la vista detallada
  };

  return (
    <div className="celebrities-section">
      <h2 className="section-title-celebrities">Celebridades más Populares</h2>
      <div className="celebrities-grid">
        {celebrities.slice(0, 6).map((celebrity) => (
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