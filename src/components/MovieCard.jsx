
export default function MovieCard({ m, onAnalyze }) {
  const poster = m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : '';
  return (
    <div className="card flex gap-4">
      {poster && <img src={poster} alt="poster" className="w-24 h-32 object-cover rounded-xl"/>}
      <div className="flex-1">
        <div className="text-lg font-semibold">{m.title} <span className="opacity-60">({(m.release_date||'').slice(0,4)})</span></div>
        <p className="opacity-80 line-clamp-3">{m.overview}</p>
        <div className="mt-3 flex gap-2">
          <button className="btn" onClick={() => onAnalyze(m)}>Analyze</button>
        </div>
      </div>
    </div>
  );
}
