
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib_api';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const submit = async () => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      nav('/dashboard');
    } catch {
      alert('Login failed');
    }
  };
  return (
    <div className="max-w-md mx-auto card space-y-3">
      <h2 className="text-2xl font-bold">Welcome back</h2>
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn" onClick={submit}>Login</button>
      <div className="opacity-70 text-sm">No account? <Link className="link" to="/signup">Sign up</Link></div>
    </div>
  );
}
