import "./CelebrityGallery.css";

export default function CelebrityGallery({ images, celebrityName }) {
  if (!images || images.length === 0) return null;

  return (
    <div>
      <h2 className="h2-fotos"><span className="l-yellow">l</span>Fotos <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="ipc-icon ipc-icon--chevron-right-inline ipc-icon--inline ipc-title-link ipc-title-link-chevron" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M5.622.631A2.153 2.153 0 0 0 5 2.147c0 .568.224 1.113.622 1.515l8.249 8.34-8.25 8.34a2.16 2.16 0 0 0-.548 2.07c.196.74.768 1.317 1.499 1.515a2.104 2.104 0 0 0 2.048-.555l9.758-9.866a2.153 2.153 0 0 0 0-3.03L8.62.61C7.812-.207 6.45-.207 5.622.63z"></path></svg></h2>
      <div className="celebrity-gallery">
        {images.map((img, index) => (
          <img
            key={index}
            src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
            alt={`${celebrityName} ${index + 1}`}
            className={`celebrity-gallery-photo ${index % 4 === 0 ? "big" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
