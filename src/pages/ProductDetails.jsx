import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/mockData';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const timerRef = useRef(null);
  
  const handleAddToCart = () => {
    addToCart(mainProduct, quantity);
    
    // Clear existing timer if any to restart the feedback cycle
    if (timerRef.current) clearTimeout(timerRef.current);
    
    setIsAdded(true);
    timerRef.current = setTimeout(() => setIsAdded(false), 1000); // Shorter duration
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQuantity(1);
    setImageLoaded(false); // Reset loader for next image
    
    // Check if the image cache resolves it instantly
    if (imgRef.current && imgRef.current.complete) {
        setImageLoaded(true);
    }
  }, [id]);

  // Find the product by ID from mockData
  const mainProduct = products.find(p => p.id === parseInt(id)) || products[0];

  const handleDecrease = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  const handleIncrease = () => setQuantity(prev => prev + 1);

  return (
    <div className="product-details-page container">
      <div className="product-layout">
        
        {/* Right side (Image) */}
        <div className="product-image-container">
          {!imageLoaded && (
            <div className="image-loader-pulse"></div>
          )}
          
          {(() => {
            const match = mainProduct.image.match(/(.*)\.(png|jpe?g)$/i);
            const encodedBase = match ? encodeURI(match[1]) : '';
            const rp = match ? {
              srcSet: `${encodedBase}-320.webp 320w, ${encodedBase}-640.webp 640w, ${encodedBase}-1024.webp 1024w`,
              sizes: "(max-width: 768px) 100vw, 50vw"
            } : null;
            return (
              <picture className="main-product-picture" key={mainProduct.id} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {rp && <source type="image/webp" srcSet={rp.srcSet} sizes={rp.sizes} />}
                <img 
                  ref={imgRef}
                  src={mainProduct.image} 
                  alt={mainProduct.name} 
                  className={`main-product-img ${imageLoaded ? 'loaded' : ''}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => { e.target.style.display = 'none'; setImageLoaded(true); }} 
                />
              </picture>
            );
          })()}
        </div>

        {/* Left side (Details) */}
        <div className="product-info-container">
          <h1 className="main-title">{mainProduct.name}</h1>
          <div className="main-price">
            <span className="price-val">{mainProduct.price}</span>
            <span className="price-cur">{mainProduct.currency}</span>
          </div>
          
          <p className="product-description">
            صندوق مكسرات هدايا فاخر من محاصيل المكسرات السورية العريقة محمص بالطريقة الصحية، 
            ممتاز للتقديم أو الاستخدام كوجبة خفيفة.
          </p>
          
          <div className="purchase-actions flex gap-4">
            <button 
              className={`btn-primary flex-1 btn-add-main ${isAdded ? 'added' : ''}`} 
              onClick={handleAddToCart}
            >
              {isAdded ? '✔ تمت الإضافة' : 'أضف للسلة'}
            </button>
            <div className="quantity-selector">
              <button onClick={handleDecrease} className="qty-btn">-</button>
              <span className="qty-val">{quantity}</span>
              <button onClick={handleIncrease} className="qty-btn">+</button>
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Related Products Section */}
      <div className="related-products">
         <h2 className="section-title">منتجات ذات صلة</h2>
         {/* Using flexible slider on mobile */}
         <div className="product-grid slider-on-mobile">
            {products.slice(0,4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
         </div>
      </div>

    </div>
  );
};

export default ProductDetails;
