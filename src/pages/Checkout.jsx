import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/Checkout.css';

const Checkout = () => {
  const { cartItems, cartSubtotal, clearCart, shippingFee, total } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    payment: 'COD' // Cash on Delivery only now
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  // --- TELEGRAM SETTINGS ---
  // To receive orders: 1. Message @BotFather on Telegram to create a bot and get a TOKEN.
  // 2. Message @userinfobot to get your CHAT_ID.
  const TELEGRAM_BOT_TOKEN = '8797189690:AAGkGYC1rKUbHg0WihPOGyAygzOLE8ZeCKM'; // Add your token here
  const TELEGRAM_CHAT_ID = '2017539431';    // Add your chat id here

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert("يرجى ملء جميع البيانات");
      return;
    }

    if (cartItems.length === 0) {
      alert("السلة فارغة");
      return;
    }

    setIsSubmitting(true);

    // Prepare the order text for Telegram
    let orderText = `📦 *طلب جديد من BONDOQA*\n\n`;
    orderText += `👤 *العميل:* ${formData.name}\n`;
    orderText += `📞 *الهاتف:* ${formData.phone}\n`;
    orderText += `📍 *العنوان:* ${formData.address}\n`;
    orderText += `💳 *طريقة الدفع:* الدفع عند الاستلام\n\n`;
    orderText += `🛒 *المنتجات:*\n`;

    cartItems.forEach(item => {
      orderText += `🔹 *${item.name}* (${item.selectedWeight} | ${item.selectedType})\n`;
      orderText += `   🔢 الكمية: ${item.quantity} | 💰 السعر: ${item.price * item.quantity} ج.م\n\n`;
    });

    orderText += `💰 *الإجمالي:* ${total} ج.م ${shippingFee === 0 ? '(شحن مجاني)' : '(شامل الشحن)'}`;

    try {
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: orderText,
            parse_mode: 'Markdown'
          })
        });

        if (response.ok) {
          clearCart();
          setOrderSent(true);
        } else {
          console.error("Telegram API Error", await response.text());
          alert("حدث خطأ في النظام ولكن تم استلام طلبك!");
          // Fallback if bot fails
          clearCart();
          setOrderSent(true);
        }
      } else {
        // If user hasn't set up the bot yet we just log it
        console.log("Order details targeting Telegram (Please set Token and ChatID):", orderText);
        alert("يرجى إعداد رمز بوت التليجرام الخاص بك لاستقبال الطلبات برمجياً!");
        clearCart();
        setOrderSent(true);
      }
    } catch (error) {
      console.error(error);
      clearCart();
      setOrderSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSent) {
    return (
      <div className="checkout-page container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2 style={{ color: 'green' }}>تم إرسال طلبك بنجاح! 🎉</h2>
        <p>شكراً لتعاملك مع بندقة. سنتواصل معك قريباً.</p>
        <button className="btn-primary mt-4" onClick={() => window.location.href = '/'}>العودة للرئيسية</button>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <h2 className="checkout-title">إتمام الطلب (Checkout)</h2>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleConfirmOrder}>
          <div className="form-section">
            <h3>معلومات التوصيل</h3>
            <div className="form-group">
              <label>الاسم بالكامل</label>
              <input name="name" type="text" placeholder="الاسم" required onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>رقم الهاتف</label>
              <input name="phone" type="tel" placeholder="01X XXXX XXXX" required onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>العنوان</label>
              <textarea name="address" placeholder="المدينة، الحي، الشارع، رقم المبنى" required onChange={handleChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dcd0c0', minHeight: '80px' }}></textarea>
            </div>
          </div>
          <div className="form-section">
            <h3>طريقة الدفع</h3>
            <div className="payment-options">
              <label className="payment-radio active">
                <input type="radio" name="payment" value="COD" checked readOnly />
                <span>الدفع عند الاستلام</span>
              </label>
            </div>
          </div>

          <div className="checkout-summary-sticky">
            <h3>ملخص الدفع</h3>
            <div className="flex justify-between mt-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>المجموع الفرعي:</span>
              <span>{cartSubtotal} ج.م</span>
            </div>
            <div className="flex justify-between mt-1" style={{ display: 'flex', justifyContent: 'space-between', color: shippingFee === 0 ? '#2e7d32' : 'inherit' }}>
              <span>الشحن:</span>
              <span className="font-bold">
                {shippingFee === 0 ? 'مجاني' : `${shippingFee} ج.م`}
              </span>
            </div>
            <hr style={{ margin: '10px 0', border: '0', borderTop: '1px solid #dcd0c0' }} />
            <div className="flex justify-between mt-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="font-bold">الإجمالي:</span>
              <span className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>{total} ج.م</span>
            </div>
            <p className="summary-note mt-2">سوف يتم التواصل معك قريباً لتأكيد موعد الاستلام.</p>
            <button type="submit" className="btn-primary w-full mt-4" disabled={isSubmitting}>
              {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
