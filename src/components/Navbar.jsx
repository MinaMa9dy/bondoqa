import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { logoPath } from '../data/mockData';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { cartCount } = useCart();
  const [isBumped, setIsBumped] = React.useState(false);

  React.useEffect(() => {
    if (cartCount === 0) return;
    setIsBumped(true);
    const timer = setTimeout(() => setIsBumped(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);
  
  return (
    <header className="navbar">
      <div className="container flex justify-between items-center navbar-inner">
        
        <Link to="/" className="navbar-brand flex items-center">
          {(() => {
            const match = logoPath.match(/(.*)\.(png|jpe?g)$/i);
            const encodedBase = match ? encodeURI(match[1]) : '';
            const rp = match ? {
              srcSet: `${encodedBase}-320.webp 320w, ${encodedBase}-640.webp 640w`,
              sizes: "150px"
            } : null;
            return (
              <picture>
                {rp && <source type="image/webp" srcSet={rp.srcSet} sizes={rp.sizes} />}
                <img src={logoPath} alt="BONDOQA Logo" className="navbar-logo-img" onError={(e) => {
                  e.target.style.display = 'none';
                }} />
              </picture>
            );
          })()}
        </Link>
        
        {/* Navigation Links */}
        <nav className="navbar-nav">
          <ul className="flex gap-8">
            <li><Link to="/" className="nav-link active">الرئيسية</Link></li>
            <li><Link to="/products" className="nav-link">المنتجات</Link></li>
          </ul>
        </nav>
        
        {/* Actions */}
        <div className="navbar-actions flex items-center gap-4">
          <Link to="/cart" className={`icon-btn cart-btn ${isBumped ? 'bump' : ''}`} aria-label="Shopping Cart">
            <ShoppingCart size={22} />
            <span className="cart-badge">{cartCount}</span>
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
