import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartSubtotal } = useCart();
  const total = cartSubtotal + (cartItems.length > 0 ? 70 : 0);

  return (
    <div className="cart-page container">
      <div className="cart-layout">
        
        {/* Cart Items List */}
        <div className="cart-list">
          <h2 className="cart-title">سلة المشتريات</h2>
          {cartItems.length === 0 ? <p>سلة المشتريات فارغة</p> : cartItems.map((item) => (
            <div key={item.id} className="cart-item">
               <div className="cart-item-img-wrap">
                 <img src={item.image} alt={item.name} />
               </div>
               <div className="cart-item-info">
                 <h4 className="cart-item-name">{item.name}</h4>
                 <div className="cart-item-price">
                   {item.price} {item.currency}
                 </div>
               </div>
               
               <div className="cart-item-actions flex items-center gap-4">
                 <div className="quantity-selector-sm">
                    <button className="qty-btn-sm" onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span className="qty-val-sm">{item.quantity}</span>
                    <button className="qty-btn-sm" onClick={() => updateQuantity(item.id, 1)}>+</button>
                 </div>
                 <button className="btn-remove" onClick={() => removeFromCart(item.id)}>
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
              <span>{cartSubtotal} EGP</span>
            </div>
            <div className="summary-row">
              <span>الشحن</span>
              <span>{cartItems.length > 0 ? 70 : 0} EGP</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-row summary-total">
              <span>الإجمالي</span>
              <span>{total} EGP</span>
            </div>
            <Link to="/checkout" style={{textDecoration: 'none'}}>
              <button className="btn-primary w-full mt-4">تأكيد الطلب</button>
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Cart;
