import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const getResponsiveSources = (originalSrc) => {
    // Assuming format is /images/name.ext
    const match = originalSrc.match(/(.*)\.(png|jpe?g)$/i);
    if (!match) return null;
    const base = encodeURI(match[1]); // Fixes spaces breaking srcSet
    return {
      srcSet: `${base}-320.webp 320w, ${base}-640.webp 640w, ${base}-1024.webp 1024w`,
      sizes: "(max-width: 480px) 320px, (max-width: 768px) 640px, 1024px"
    };
  };

  const rp = getResponsiveSources(product.images[0]);
  
  const [isAdded, setIsAdded] = React.useState(false);
  const timerRef = React.useRef(null);

  const handleAddToCart = (e) => {
    e.preventDefault();
    const defaultOption = product.options.find(opt => opt.weight === "500 gm");
    addToCart({ 
      ...product, 
      selectedWeight: "500 gm",
      selectedType: "مش كسر",
      price: defaultOption ? defaultOption.price : product.price,
      image: product.images[0]
    });
    
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsAdded(true);
    timerRef.current = setTimeout(() => setIsAdded(false), 1000);
  };
  
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-img-wrapper">
        <picture className="product-img">
          {rp && <source type="image/webp" srcSet={rp.srcSet} sizes={rp.sizes} />}
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="product-img" 
            loading="lazy" 
            onError={(e) => {
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23e8dbce'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%235c3a21'%3E%D8%B5%D9%88%D8%B1%D8%A9 %D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%3C/text%3E%3C/svg%3E";
            }}
          />
        </picture>
      </Link>
      <div className="product-info">
        <Link to={`/product/${product.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
          <h3 className="product-title">{product.name}</h3>
          <span className="product-weight" style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', display: 'block', marginBottom: '0.5rem' }}>
            {product.defaultWeight}
          </span>
        </Link>
        <div className="product-price">
          <span className="price-val">{product.price}</span>
          <span className="price-cur">{product.currency}</span>
        </div>
        <button 
          className={`btn-add-cart ${isAdded ? 'added' : ''}`} 
          onClick={(e) => {
             // Reset animation for fast repeated clicks
             handleAddToCart(e);
          }}
        >
          {isAdded ? '✔ تمت الإضافة' : 'أضف للسلة'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
