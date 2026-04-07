import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartSubtotal, shippingFee, total } = useCart();

  return (
    <div className="cart-page container">
      <div className="cart-layout">
        
        {/* Cart Items List */}
        <div className="cart-list">
          <h2 className="cart-title">سلة المشتريات</h2>
          {cartItems.length === 0 ? <p>سلة المشتريات فارغة</p> : cartItems.map((item) => (
            <div key={`${item.id}-${item.selectedWeight}-${item.selectedType}`} className="cart-item">
               <div className="cart-item-img-wrap">
                 {(() => {
                    const match = item.image.match(/(.*)\.(png|jpe?g)$/i);
                    const encodedBase = match ? encodeURI(match[1]) : '';
                    const rp = match ? {
                      srcSet: `${encodedBase}-320.webp 320w`,
                      sizes: "60px"
                    } : null;
                    return (
                      <picture>
                        {rp && <source type="image/webp" srcSet={rp.srcSet} sizes={rp.sizes} />}
                        <img src={item.image} alt={item.name} />
                      </picture>
                    );
                 })()}
               </div>
               <div className="cart-item-info">
                 <h4 className="cart-item-name">
                    {item.name} 
                 </h4>
                 <div className="cart-item-meta" style={{fontSize: '0.8rem', color: 'var(--color-text-light)', marginBottom: '0.4rem'}}>
                    <span>{item.selectedWeight}</span>
                    <span style={{margin: '0 0.5rem'}}>•</span>
                    <span>{item.selectedType}</span>
                 </div>
                 <div className="cart-item-price">
                   {item.price} {item.currency}
                 </div>
               </div>
               
               <div className="cart-item-actions flex items-center gap-4">
                 <div className="quantity-selector-sm">
                    <button className="qty-btn-sm" onClick={() => updateQuantity(item.id, item.selectedWeight, item.selectedType, -1)}>-</button>
                    <span className="qty-val-sm">{item.quantity}</span>
                    <button className="qty-btn-sm" onClick={() => updateQuantity(item.id, item.selectedWeight, item.selectedType, 1)}>+</button>
                 </div>
                 <button className="btn-remove" onClick={() => removeFromCart(item.id, item.selectedWeight, item.selectedType)}>
                   <Trash2 size={20} />
                 </button>
               </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary-wrapper">
          <div className="cart-summary">
            <h3 className="summary-title">ملخص الطلب</h3>
            <div className="summary-row">
              <span>المجموع الفرعي</span>
              <span>{cartSubtotal} ج.م</span>
            </div>
            <div className="summary-row">
              <span>الشحن</span>
              <span className={shippingFee === 0 && cartSubtotal >= 500 ? 'free-shipping' : ''}>
                {shippingFee === 0 && cartSubtotal >= 500 ? 'مجاني' : `${shippingFee} ج.م`}
              </span>
            </div>
            {cartSubtotal < 500 && cartItems.length > 0 && (
              <p style={{fontSize: '0.75rem', color: 'var(--color-primary)', marginTop: '0.5rem', textAlign: 'center'}}>
                أضف <b>{500 - cartSubtotal} ج.م</b> إضافية للحصول على شحن مجاني! 🚚
              </p>
            )}
            {cartSubtotal >= 500 && (
              <p style={{fontSize: '0.75rem', color: '#2e7d32', marginTop: '0.5rem', textAlign: 'center'}}>
                مبروك! لقد حصلت على شحن مجاني 🥳
              </p>
            )}
            <hr className="summary-divider" />
            <div className="summary-row summary-total">
              <span>الإجمالي</span>
              <span>{total} ج.م</span>
            </div>
            <Link to="/checkout" style={{textDecoration: 'none'}} onClick={(e) => {
              if (cartItems.length === 0) {
                e.preventDefault();
                alert("السلة فاضية يا بطل! ضيف شوية مكسرات الأول عشان نقدر نأكد الطلب. 😊");
              }
            }}>
              <button 
                className={`btn-primary w-full mt-4 ${cartItems.length === 0 ? 'disabled' : ''}`}
                disabled={cartItems.length === 0}
              >
                تأكيد الطلب
              </button>
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Cart;
