
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const link = ({ isActive }) =>
    `px-3 py-2 rounded-lg ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`;
  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-black/30 border-b border-white/10">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="text-xl font-bold tracking-wide">CineLens</Link>
        <div className="flex items-center gap-2">
          <NavLink to="/search" className={link}>Search</NavLink>
          <NavLink to="/analyze" className={link}>Analyze Script</NavLink>
          <NavLink to="/stats" className={link}>Stats</NavLink>
          <NavLink to="/dashboard" className={link}>Dashboard</NavLink>
          <NavLink to="/login" className={link}>Login</NavLink>
        </div>
      </div>
    </nav>
  );
}
