import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

export default function ProductsAdmin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category_id: '', image: null });
  const [saving, setSaving] = useState(false);
  const [catName, setCatName] = useState('');
  const [savingCat, setSavingCat] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) return navigate('/login');
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([api.get('/admin/products'), api.get('/categories')]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch (err) {
      if (err.response?.status === 403) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  /* ── Categories ── */
  const addCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setSavingCat(true);
    try {
      await api.post('/admin/categories', { name: catName.trim() });
      setCatName('');
      fetchAll();
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.message || 'Nom invalide ou déjà existant'));
    } finally {
      setSavingCat(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      fetchAll();
    } catch {
      alert('Impossible de supprimer (produits liés ?)');
    }
  };

  /* ── Products ── */

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: '', category_id: '', image: '' });
  };

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, description: p.description || '', price: p.price, category_id: p.category_id || '', image: p.image || '' });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || '',
        price: form.price,
      };
      if (form.category_id) payload.category_id = form.category_id;
      if (form.image) payload.image = form.image;

      if (editing) {
        await api.put(`/admin/products/${editing}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }
      resetForm();
      fetchAll();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        alert('Erreurs :\n' + Object.values(data.errors).flat().join('\n'));
      } else {
        alert('Erreur : ' + (data?.message || 'Vérifiez les champs'));
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await api.delete(`/admin/products/${id}`);
    fetchAll();
  };

  const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Administration</h1>

      {/* ── Categories ── */}
      <div className="bg-gray-50 rounded-xl p-6 mb-10">
        <h2 className="font-semibold text-gray-900 mb-4">Catégories</h2>

        <form onSubmit={addCategory} className="flex gap-3 mb-4">
          <input
            type="text"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="Nom de la catégorie"
            className={inputCls + ' max-w-xs'}
          />
          <button
            type="submit"
            disabled={savingCat}
            className="bg-gray-900 text-white font-semibold px-5 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm whitespace-nowrap"
          >
            {savingCat ? 'Ajout…' : 'Ajouter'}
          </button>
        </form>

        {categories.length === 0 ? (
          <p className="text-sm text-gray-400">Aucune catégorie.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span key={c.id} className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-700">
                {c.name}
                <button
                  onClick={() => deleteCategory(c.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Supprimer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Product Form ── */}
      <form onSubmit={save} className="bg-gray-50 rounded-xl p-6 mb-10">
        <h2 className="font-semibold text-gray-900 mb-4">
          {editing ? 'Modifier le produit' : 'Ajouter un produit'}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
            <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className={inputCls}>
              <option value="">— Aucune —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image (URL)</label>
            <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputCls} placeholder="https://exemple.com/image.avif" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-gray-900 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm"
          >
            {saving ? 'Enregistrement…' : editing ? 'Modifier' : 'Ajouter'}
          </button>
          {editing && (
            <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* Product list */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-50 rounded-lg" />)}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center py-10">Aucun produit.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="py-3 pr-4 font-medium">Produit</th>
                <th className="py-3 pr-4 font-medium">Prix</th>
                <th className="py-3 pr-4 font-medium">Catégorie</th>
                <th className="py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.image ? (
                          <img
                            src={p.image.startsWith('http') ? p.image : `http://localhost:8000/storage/${p.image}`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{Number(p.price).toFixed(2)} €</td>
                  <td className="py-3 pr-4 text-gray-600">{p.category?.name || '—'}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => startEdit(p)} className="text-gray-500 hover:text-gray-900 transition-colors mr-3">
                      Modifier
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:text-red-700 transition-colors">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
