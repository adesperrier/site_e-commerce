import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/api';

export default function Success() {
  const [searchParams] = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const [status, setStatus] = useState(paymentIntentId ? 'loading' : 'success');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!paymentIntentId) return;

    // If we have a payment_intent, it means we came back from a Stripe redirection (e.g. 3DS)
    // We need to confirm the order in our backend
    const createOrder = async () => {
      try {
        await api.post('/orders', { paymentIntentId });
        setStatus('success');
      } catch (err) {
        console.error("Error confirming order:", err);
        // If the order was already created, the backend returns 200 with message "Order already created"
        // But if it failed, we show error
        if (err.response?.data?.message === 'Order already created') {
          setStatus('success');
        } else {
          setStatus('error');
          setError("Erreur lors de la confirmation de la commande. Veuillez contacter le support.");
        }
      }
    };

    createOrder();
  }, [paymentIntentId]);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Validation de votre paiement...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-500 mb-8">{error}</p>
          <Link to="/contact" className="text-indigo-600 hover:text-indigo-500">Contacter le support</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
        <p className="text-gray-500 mb-8">
          Merci pour votre achat. Vous recevrez un email de confirmation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/orders"
            className="bg-gray-900 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            Voir mes commandes
          </Link>
          <Link
            to="/products"
            className="border border-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}
