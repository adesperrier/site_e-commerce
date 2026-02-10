import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCat = searchParams.get('category') || '';

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/products')
      .then((r) => {
        let list = r.data;
        if (activeCat) list = list.filter((p) => String(p.category_id) === activeCat);
        setProducts(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCat]);

  const selectCat = (id) => {
    if (id) setSearchParams({ category: id });
    else setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-gray-900">Nos produits</h1>
      <p className="mt-1 text-sm text-gray-500 mb-8">Toute notre sélection freeride et ski</p>

      {/* Filters */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => selectCat('')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !activeCat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => selectCat(String(c.id))}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCat === String(c.id) ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] rounded-xl bg-gray-100" />
              <div className="mt-3 h-4 w-3/4 bg-gray-100 rounded" />
              <div className="mt-2 h-3 w-1/3 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center py-20">Aucun produit trouvé.</p>
      ) : (
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
      )}
    </div>
  );
}
