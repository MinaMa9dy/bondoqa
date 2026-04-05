import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/mockData';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  // Scroll to top and reset quantity when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
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
          <img src={mainProduct.image} alt={mainProduct.name} className="main-product-img" 
             onError={(e) => { e.target.style.display = 'none'; }} />
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
            <button className="btn-primary flex-1 btn-add-main" onClick={() => addToCart(mainProduct, quantity)}>أضف للسلة</button>
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
