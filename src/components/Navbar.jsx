import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ShoppingCart } from 'lucide-react';
import { logoPath } from '../data/mockData';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { cartCount } = useCart();
  
  return (
    <header className="navbar">
      <div className="container flex justify-between items-center navbar-inner">
        
        {/* Brand/Logo Area */}
        <Link to="/" className="navbar-brand flex items-center gap-2">
          <img src={logoPath} alt="BONDOQA Logo" className="navbar-logo-img" onError={(e) => {
            // Fallback if user hasn't added the logo yet.
            e.target.style.display = 'none';
          }} />
          <div className="navbar-brand-text">
            <h1 className="brand-title">بندقة</h1>
            <span className="brand-subtitle">BONDOQA</span>
          </div>
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
          <button className="icon-btn" aria-label="Search"><Search size={22} /></button>
          <button className="icon-btn" aria-label="User Profile"><User size={22} /></button>
          <Link to="/cart" className="icon-btn cart-btn" aria-label="Shopping Cart">
            <ShoppingCart size={22} />
            <span className="cart-badge">{cartCount}</span>
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
