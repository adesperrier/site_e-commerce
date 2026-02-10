import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-lg font-bold text-white mb-3">FreeSkis</h3>
            <p className="text-sm leading-relaxed">
              L'équipement freeride et ski de qualité premium, livré chez vous.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white transition-colors">Produits</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Panier</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Commandes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>contact@freeskis.fr</li>
              <li>+33 4 00 00 00 00</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-800 text-xs text-center">
          © {new Date().getFullYear()} FreeSkis — Tous droits réservés
        </div>
      </div>
    </footer>
  );
}
