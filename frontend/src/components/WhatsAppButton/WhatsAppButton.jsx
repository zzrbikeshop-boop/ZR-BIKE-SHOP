import React, { useState } from 'react';
import './WhatsAppButton.css';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(''); // حالة لتخزين رسالة الزبون
  
  // ضع رقم هاتفك هنا (بعد 213 بدون الصفر الأول)
  const phoneNumber = "2130697762181"; // استبدل هذا بالرقم الفعلي
  const defaultMessage = "مرحباً، أريد الاستفسار عن منتجات متجر ZR Bike";
  
  // دالة الإرسال: تأخذ النص المكتوب أو النص الافتراضي وتفتح واتساب
  const handleSend = () => {
    const textToSend = message.trim() ? message : defaultMessage;
    const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(waLink, '_blank');
    setMessage(''); // مسح الحقل بعد الإرسال
    setIsOpen(false); // إغلاق النافذة
  };

  // الإرسال عند الضغط على زر Enter في لوحة المفاتيح
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // الحصول على الوقت الحالي لعرضه في الرسالة
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="whatsapp-widget-container" dir="rtl">
      
      {/* ----- نافذة المحادثة المنبثقة ----- */}
      <div className={`whatsapp-chat-box ${isOpen ? 'open' : ''}`}>
        
        {/* رأس النافذة */}
        <div className="chat-header">
          <div className="header-info">
            <img src="/logo.jpg" alt="DARAJATI" className="chat-avatar" />
            <div>
              <h4>DARAJATI</h4>
              <p>عادة ما نرد خلال دقائق</p>
            </div>
          </div>
          <button className="close-chat" onClick={() => setIsOpen(false)} aria-label="إغلاق">✕</button>
        </div>
        
        {/* جسم النافذة (مساحة الرسائل) */}
        <div className="chat-body">
          <div className="chat-message">
            مرحباً بك في متجر DARAJATI! 🚴‍♂️<br />
            اكتب استفسارك بالأسفل وسنرد عليك عبر الواتساب فوراً.
            <span className="msg-time">{currentTime}</span>
          </div>
        </div>

        {/* أسفل النافذة (حقل إدخال الرسالة وزر الإرسال) */}
        <div className="chat-footer-input">
          <input 
            type="text" 
            placeholder="اكتب رسالتك هنا..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button className="send-btn" onClick={handleSend} aria-label="إرسال">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* ----- الزر العائم الأساسي ----- */}
    {/* ----- الزر العائم الأساسي ----- */}
      <button 
        className="whatsapp-float" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="تواصل معنا عبر واتساب"
      >
        {/* إذا كانت النافذة مفتوحة نعرض علامة (X)، وإذا كانت مغلقة نعرض شعار الواتساب الرسمي */}
        {isOpen ? (
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg viewBox="0 0 32 32" className="whatsapp-icon" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.05 2.5C8.6 2.5 2.55 8.55 2.55 16c0 2.37.62 4.68 1.8 6.7L2.5 29.5l6.97-1.83c1.97 1.06 4.18 1.63 6.48 1.63h.02c7.45 0 13.5-6.05 13.5-13.5S23.5 2.5 16.05 2.5zm0 22.45h-.01c-2 0-3.96-.54-5.68-1.55l-.4-.24-4.22 1.1.13-4.1-.26-.42c-1.1-1.76-1.68-3.78-1.68-5.88 0-6.12 4.98-11.1 11.1-11.1 6.13 0 11.1 4.98 11.1 11.1s-4.97 11.1-11.08 11.1zm6.08-8.32c-.33-.17-1.98-.98-2.28-1.09-.31-.1-.53-.17-.76.17-.22.34-.86 1.09-1.06 1.31-.18.22-.38.25-.71.08-1.93-.97-3.32-1.9-4.58-3.8-.18-.28 0-.42.16-.58.15-.15.33-.39.5-.59.16-.2.22-.34.33-.57.11-.23.05-.43-.03-.6-.08-.17-.76-1.83-1.04-2.5-.27-.66-.54-.57-.76-.58-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.85 0 1.68 1.23 3.3 1.4 3.53.17.23 2.4 3.66 5.82 5.14 2.3.99 3.16 1.06 4.23.9 1.17-.18 2.28-1.04 2.6-2.02.31-.98.31-1.82.22-2-.1-.17-.33-.26-.66-.43z" fill="currentColor"/>
          </svg>
        )}
      </button>

    </div>
  );
}