import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-img-wrapper">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-img" 
          onError={(e) => {
            // Fallback placeholder
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23e8dbce'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%235c3a21'%3E%D8%B5%D9%88%D8%B1%D8%A9 %D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%3C/text%3E%3C/svg%3E";
          }}
        />
      </Link>
      <div className="product-info">
        <Link to={`/product/${product.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <div className="product-price">
          <span className="price-val">{product.price}</span>
          <span className="price-cur">{product.currency}</span>
        </div>
        <button 
          className="btn-add-cart" 
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
        >
          أضف للسلة
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
