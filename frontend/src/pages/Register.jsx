import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm({ ...form, [k]: v });

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const { data } = await api.post('/register', form);
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setErrors(err.response?.data?.errors || { general: ['Erreur lors de l\'inscription'] });
    } finally {
      setLoading(false);
    }
  };

  const firstError = Object.values(errors).flat()[0];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-bold text-gray-900 text-center mb-8">Créer un compte</h1>

        <form onSubmit={submit} className="space-y-4">
          {firstError && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{firstError}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              placeholder="Jean Dupont"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              placeholder="vous@exemple.fr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              required
              value={form.password_confirmation}
              onChange={(e) => set('password_confirmation', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white font-semibold py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm"
          >
            {loading ? 'Inscription…' : 'S\'inscrire'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-medium text-gray-900 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
