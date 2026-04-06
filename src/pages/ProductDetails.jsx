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
  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedType, setSelectedType] = useState('مش كسر'); // Default to whole
  const [displayPrice, setDisplayPrice] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const timerRef = useRef(null);
  
  // Find the product by ID from mockData
  const mainProduct = products.find(p => p.id === parseInt(id)) || products[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQuantity(1);
    setImageLoaded(false);
    setSelectedWeight(mainProduct.defaultWeight);
    setCurrentImageIndex(0);
    
    const defaultOption = mainProduct.options.find(opt => opt.weight === mainProduct.defaultWeight);
    setDisplayPrice(defaultOption ? defaultOption.price : mainProduct.price);

    if (imgRef.current && imgRef.current.complete) {
        setImageLoaded(true);
    }
  }, [id, mainProduct]);

  useEffect(() => {
    const updatePrice = () => {
      const option = mainProduct.options.find(opt => opt.weight === selectedWeight);
      if (option) {
        // If type is "كسر" and there's a ksrPrice, use it. Otherwise use normal price.
        const price = (selectedType === 'كسر' && option.ksrPrice) ? option.ksrPrice : option.price;
        setDisplayPrice(price);
      }
    };
    updatePrice();
  }, [selectedWeight, selectedType, mainProduct]);

  const handleWeightChange = (weight) => {
    setSelectedWeight(weight);
  };

  const handleAddToCart = () => {
    addToCart({
      ...mainProduct,
      price: displayPrice,
      selectedWeight: selectedWeight,
      selectedType: selectedType, // Add the selected type to cart
      image: mainProduct.images[currentImageIndex]
    }, quantity);
    
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsAdded(true);
    timerRef.current = setTimeout(() => setIsAdded(false), 1000);
  };

  const handleDecrease = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  const handleIncrease = () => setQuantity(prev => prev + 1);

  return (
    <div className="product-details-page container">
      <div className="product-layout">
        
        {/* Right side (Carousel) */}
        <div className="product-image-container">
          {!imageLoaded && (
            <div className="image-loader-pulse"></div>
          )}
          
          <div className="carousel-main">
            {(() => {
              const currentImg = mainProduct.images[currentImageIndex];
              const match = currentImg.match(/(.*)\.(png|jpe?g)$/i);
              const encodedBase = match ? encodeURI(match[1]) : '';
              const rp = match ? {
                srcSet: `${encodedBase}-320.webp 320w, ${encodedBase}-640.webp 640w, ${encodedBase}-1024.webp 1024w`,
                sizes: "(max-width: 768px) 100vw, 50vw"
              } : null;
              return (
                <picture className="main-product-picture" key={`${mainProduct.id}-${currentImageIndex}`} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {rp && <source type="image/webp" srcSet={rp.srcSet} sizes={rp.sizes} />}
                  <img 
                    ref={imgRef}
                    src={currentImg} 
                    alt={mainProduct.name} 
                    className={`main-product-img ${imageLoaded ? 'loaded' : ''}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => { e.target.style.display = 'none'; setImageLoaded(true); }} 
                  />
                </picture>
              );
            })()}
          </div>

          {/* Thumbnails / Dots */}
          {mainProduct.images.length > 1 && (
            <div className="carousel-thumbnails">
              {mainProduct.images.map((img, idx) => (
                <div 
                  key={idx}
                  className={`thumb-wrap ${currentImageIndex === idx ? 'active' : ''}`}
                  onClick={() => {
                    if (currentImageIndex !== idx) {
                        setImageLoaded(false);
                        setCurrentImageIndex(idx);
                    }
                  }}
                >
                  <img src={img} alt={`${mainProduct.name} ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Left side (Details) */}
        <div className="product-info-container">
          <h1 className="main-title">{mainProduct.name}</h1>
          <div className="main-price">
            <span className="price-val">{displayPrice}</span>
            <span className="price-cur">{mainProduct.currency}</span>
          </div>

          <div className="mixed-badge-line">
            <span className={`status-dot ${mainProduct.isMixed ? 'mixed' : 'whole'}`}></span>
            <span className="status-text">
              {mainProduct.isMixed ? 'كسر ومش كسر' : 'مش كسر'}
            </span>
          </div>
          
          <div className="weight-selection-container">
            <label className="selection-label">اختر الكمية:</label>
            <div className="weight-chips">
              {mainProduct.options.map(opt => (
                <button 
                  key={opt.weight}
                  className={`weight-chip ${selectedWeight === opt.weight ? 'active' : ''}`}
                  onClick={() => handleWeightChange(opt.weight)}
                >
                  {opt.weight}
                </button>
              ))}
            </div>
          </div>

          <div className="type-selection-container">
            <label className="selection-label">النوع:</label>
            <div className="weight-chips">
               <button 
                  className={`weight-chip ${selectedType === 'مش كسر' ? 'active' : ''}`}
                  onClick={() => setSelectedType('مش كسر')}
                >
                  مش كسر
                </button>
                {mainProduct.isMixed && (
                  <button 
                    className={`weight-chip ${selectedType === 'كسر' ? 'active' : ''}`}
                    onClick={() => setSelectedType('كسر')}
                  >
                    كسر
                  </button>
                )}
            </div>
          </div>

          <p className="product-description">
            {mainProduct.description || "مكسرات فاخرة من أجود المحاصيل المحمصة بعناية لتناسب ذوقكم."}
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
