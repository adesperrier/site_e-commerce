import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const addToCart = async () => {
    if (!localStorage.getItem('token')) return navigate('/login');
    setAdding(true);
    try {
      await api.post('/cart', { product_id: product.id, quantity: qty });
      navigate('/cart');
    } catch {
      alert('Erreur lors de l\'ajout au panier');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square rounded-2xl bg-gray-100" />
          <div className="space-y-4 pt-4">
            <div className="h-8 w-2/3 bg-gray-100 rounded" />
            <div className="h-5 w-1/4 bg-gray-100 rounded" />
            <div className="h-20 w-full bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const imgSrc = product.image
    ? product.image.startsWith('http') ? product.image : `http://localhost:8000/storage/${product.image}`
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Retour
      </button>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
          {imgSrc ? (
            <img src={imgSrc} alt={product.name} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <h1 className="font-display text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{Number(product.price).toFixed(2)} €</p>

          {product.description && (
            <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>
          )}

          {/* Quantity + Add */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                −
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-900 min-w-[2.5rem] text-center">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={addToCart}
              disabled={adding}
              className="flex-1 bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm"
            >
              {adding ? 'Ajout…' : 'Ajouter au panier'}
            </button>
          </div>

          {/* Extra info */}
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium text-gray-900 block">Livraison</span>
              Gratuite dès 100 €
            </div>
            <div>
              <span className="font-medium text-gray-900 block">Retour</span>
              30 jours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
