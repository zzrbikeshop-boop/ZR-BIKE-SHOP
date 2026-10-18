import { useState, useEffect } from 'react';
// التعديل هنا: أضفنا ../ أخرى للرجوع خطوتين للخلف والوصول للملف الصحيح
import { useApp } from '../../context/AppContext'; 
import './Reviews.css';

export default function Reviews() {
  const { t, lang } = useApp(); // جلب اللغة الحالية

  const reviewImages = [
     "/reviews/in1(1).jpg", "/reviews/in1(2).jpg",
    "/reviews/in1(3).jpg", "/reviews/in1(4).jpg", "/reviews/in1(5).jpg",
    "/reviews/in1(6).jpg", "/reviews/in1(7).jpg", "/reviews/in1(8).jpg",
    "/reviews/in1(9).jpg", "/reviews/in1(10).jpg", "/reviews/in1(11).jpg",
    "/reviews/in1(12).jpg", "/reviews/in1(13).jpg", "/reviews/in1(14).jpg",
    "/reviews/in1(15).jpg", "/reviews/in1(16).jpg", "/reviews/in1(17).jpg",
    "/reviews/in1(18).jpg", "/reviews/in1(19).jpg", "/reviews/in1(20).jpg"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviewImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [reviewImages.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviewImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviewImages.length) % reviewImages.length);
  };

  // تحديد النص بناءً على اللغة
  const reviewsTitle = lang === 'en' ? 'Our Customers Reviews' : 'آراء وثقة عملائنا';

  return (
    <section className="reviews-section">
      <div className="section-header">
        {/* عرض العنوان المتوافق مع اللغة */}
        <h2>{reviewsTitle}</h2>
      </div>

      <div className="coverflow-wrapper">
        <button className="nav-btn right-btn" onClick={prevSlide} aria-label="السابق">
          &#10095;
        </button>

        <div className="coverflow-container">
          {reviewImages.map((imgSrc, index) => {
            let offset = index - currentIndex;
            
            const half = Math.floor(reviewImages.length / 2);
            if (offset < -half) offset += reviewImages.length;
            if (offset > half) offset -= reviewImages.length;

            const absOffset = Math.abs(offset);
            const isActive = offset === 0;
            
            if (absOffset > 4) return null;

            return (
              <div 
                key={index} 
                className={`coverflow-card phone-mockup ${isActive ? 'active' : ''}`}
                style={{
                  transform: `translateX(${offset * 120}px) scale(${isActive ? 1 : 0.8}) rotateY(${isActive ? 0 : offset > 0 ? -45 : 45}deg)`,
                  zIndex: 100 - absOffset,
                  opacity: absOffset > 2 ? 0 : 1,
                }}
                onClick={() => setCurrentIndex(index)}
              >
                {/* الجزء العلوي للهاتف (الكاميرا / النوتش) */}
                <div className="phone-notch-container">
                  <span className="phone-notch"></span>
                </div>

                {/* شاشة العرض وبها صورة الرأي */}
                <div className="phone-screen">
                  <img 
                    src={imgSrc} 
                    alt={`رأي الزبون ${index + 1}`} 
                    loading="lazy"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button className="nav-btn left-btn" onClick={nextSlide} aria-label="التالي">
          &#10094;
        </button>
      </div>
    </section>
  );
}