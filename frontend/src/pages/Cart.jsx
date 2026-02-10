import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const fetchCart = () => {
    setLoading(true);
    api.get('/cart')
      .then((r) => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) return navigate('/login');
    fetchCart();
  }, [navigate]);

  const updateQty = async (id, quantity) => {
    if (quantity < 1) return;
    await api.put(`/cart/${id}`, { quantity });
    fetchCart();
  };

  const remove = async (id) => {
    await api.delete(`/cart/${id}`);
    fetchCart();
  };

  const checkout = async () => {
    setChecking(true);
    try {
      const { data } = await api.post('/checkout');
      // Redirect directly to Stripe Checkout URL
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err.response?.data || err.message || err);
      alert('Erreur lors du paiement : ' + (err.response?.data?.error || err.response?.data?.message || err.message));
      setChecking(false);
    }
  };

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Panier</h1>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl bg-gray-50">
              <div className="w-24 h-24 rounded-lg bg-gray-100" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-gray-100 rounded" />
                <div className="h-3 w-1/5 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Votre panier est vide.</p>
          <Link
            to="/products"
            className="inline-block bg-gray-900 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            Voir les produits
          </Link>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-100">
            {items.map((item) => {
              const img = item.product.image
                ? item.product.image.startsWith('http') ? item.product.image : `http://localhost:8000/storage/${item.product.image}`
                : null;
              return (
                <div key={item.id} className="flex gap-4 py-5">
                  {/* Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {img ? (
                      <img src={img} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">N/A</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{Number(item.product.price).toFixed(2)} €</p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 rounded-md text-sm">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-500 hover:text-gray-900">−</button>
                        <span className="px-2 py-1 min-w-[1.5rem] text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-500 hover:text-gray-900">+</button>
                      </div>
                      <button onClick={() => remove(item.id)} className="text-xs text-red-500 hover:text-red-700 transition-colors">
                        Supprimer
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                    {(item.product.price * item.quantity).toFixed(2)} €
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <button
              onClick={checkout}
              disabled={checking}
              className="mt-6 w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm"
            >
              {checking ? 'Redirection…' : 'Passer commande'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
