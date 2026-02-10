import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const HERO_IMG = 'https://images.pexels.com/photos/3475837/pexels-photo-3475837.jpeg';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/products').then((r) => setProducts(r.data.slice(0, 8))).catch(() => {});
    api.get('/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[70vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="relative z-10 text-center text-white px-4 max-w-2xl">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Ride the&nbsp;Mountain
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/80">
            Équipement freeride sélectionné pour les riders exigeants.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            Découvrir la collection
          </Link>
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm text-gray-600">
          {[
            ['🚚', 'Livraison gratuite', 'Dès 400 € d\'achat'],
            ['🔒', 'Paiement sécurisé', 'Stripe 100 % sécurisé'],
            ['↩️', 'Retour 30 jours', 'Satisfait ou remboursé'],
          ].map(([icon, title, sub]) => (
            <div key={title} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{icon}</span>
              <span className="font-semibold text-gray-900">{title}</span>
              <span>{sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured products ── */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900">Produits populaires</h2>
              <p className="mt-1 text-sm text-gray-500">Les incontournables de la saison</p>
            </div>
            <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Tout voir →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <Link key={p.id} to={`/products/${p.id}`} className="group">
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100">
                  {p.image ? (
                    <img
                      src={p.image.startsWith('http') ? p.image : `http://localhost:8000/storage/${p.image}`}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{p.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{Number(p.price).toFixed(2)} €</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-8 text-center">
              Nos catégories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/products?category=${c.id}`}
                  className="bg-white rounded-xl p-6 text-center hover:shadow-md transition-shadow border border-gray-100"
                >
                  <span className="font-medium text-gray-900">{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-display text-3xl font-bold text-gray-900">Prêt à rider ?</h2>
        <p className="mt-3 text-gray-500 max-w-md mx-auto">
          Créez votre compte et profitez de nos offres exclusives.
        </p>
        <Link
          to="/register"
          className="mt-6 inline-block bg-gray-900 text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm"
        >
          Créer un compte
        </Link>
      </section>
    </>
  );
}
