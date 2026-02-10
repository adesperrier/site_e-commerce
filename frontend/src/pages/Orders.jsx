import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) return navigate('/login');
    api.get('/orders')
      .then((r) => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Mes commandes</h1>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="p-5 rounded-xl bg-gray-50 h-24" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center py-20">Aucune commande pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-100 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-medium text-gray-900">Commande #{order.id}</span>
                  <span className="ml-3 text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  order.status === 'completed'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-yellow-50 text-yellow-700'
                }`}>
                  {order.status === 'completed' ? 'Terminée' : order.status}
                </span>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="space-y-2 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-600">
                      <span>{item.product?.name || `Produit #${item.product_id}`} × {item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex justify-between text-sm font-semibold text-gray-900">
                <span>Total</span>
                <span>{Number(order.total).toFixed(2)} €</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
