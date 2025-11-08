
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl md:text-5xl font-black tracking-tight">CineLens</h1>
      <p className="opacity-80 max-w-2xl mx-auto">AI‑powered Bechdel Test analyzer. Search via TMDb or paste/upload scripts, then get a Pass/Fail verdict with a concise explanation. Explore community results and yearly pass trends.</p>
      <div className="flex items-center justify-center gap-3">
        <Link className="btn" to="/search">Search Movies</Link>
        <Link className="btn" to="/analyze">Analyze Script</Link>
        <Link className="btn" to="/stats">See Stats</Link>
      </div>
    </div>
  );
}
