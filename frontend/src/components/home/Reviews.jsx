import './Reviews.css'

export default function Reviews() {
  const reviewImages = [
    "/reviews/in1.jpg",
    "/reviews/in1(1).jpg",
    "/reviews/in1(2).jpg",
    "/reviews/in1(3).jpg",
    "/reviews/in1(4).jpg",
    "/reviews/in1(5).jpg",
    "/reviews/in1(6).jpg",
    "/reviews/in1(7).jpg",
    "/reviews/in1(8).jpg",
    "/reviews/in1(9).jpg",
    "/reviews/in1(10).jpg",
    "/reviews/in1(11).jpg",
    "/reviews/in1(12).jpg",
    "/reviews/in1(13).jpg",
    "/reviews/in1(14).jpg",
    "/reviews/in1(15).jpg",
    "/reviews/in1(16).jpg",
    "/reviews/in1(17).jpg",
    "/reviews/in1(18).jpg",
    "/reviews/in1(19).jpg",
    "/reviews/in1(20).jpg"
  ]

  // نكرر الصور مرتين لإنشاء حلقة متطابقة تماماً تعيد عرض نفسها بلا إنقطاع
  const infiniteImages = [...reviewImages, ...reviewImages]

  return (
    <section className="reviews-section">
      <div className="section-header">
        <h2>آراء وثقة عملائنا الكرام</h2>
        <p>نفتخر بثقتكم الغالية، وهذه تجارب وآراء زبائننا عبر الوطن في جودة دراجاتنا وقطع الغيار</p>
      </div>

      <div className="reviews-slider-container">
        <div className="reviews-track">
          {infiniteImages.map((imgSrc, index) => (
            <div key={index} className="review-card">
              <img 
                src={imgSrc} 
                alt={`رأي الزبون ${(index % reviewImages.length) + 1}`} 
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}