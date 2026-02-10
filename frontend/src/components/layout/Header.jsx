import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/api';

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      api.get('/user').then((r) => setUser(r.data)).catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-gray-900">
          FreeSkis
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/products" className="hover:text-gray-900 transition-colors">Produits</Link>
          {user?.is_admin === 1 && (
            <Link to="/admin/products" className="hover:text-gray-900 transition-colors">Admin</Link>
          )}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </Link>

          {token && user ? (
            <div className="flex items-center gap-3">
              <Link to="/orders" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Commandes
              </Link>
              <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              Connexion
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-600">
          {open ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-2">
          <Link to="/products" onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-700">Produits</Link>
          <Link to="/cart" onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-700">Panier</Link>
          {token && user ? (
            <>
              <Link to="/orders" onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-700">Commandes</Link>
              {user?.is_admin === 1 && (
                <Link to="/admin/products" onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-700">Admin</Link>
              )}
              <button onClick={() => { setOpen(false); logout(); }} className="block py-2 text-sm text-gray-700">Déconnexion</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-700">Connexion</Link>
          )}
        </div>
      )}
    </header>
  );
}
