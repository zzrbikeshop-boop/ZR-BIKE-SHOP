import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './StairsPreloader.css';

export default function StairsPreloader({ onComplete }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // مدة العرض
    const timer = setTimeout(() => {
      setLoading(false);
      if (onComplete) onComplete();
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // شرائط الدرج المتحركة
  const stairSteps = [1, 2, 3, 4, 5];

  return (
    <AnimatePresence>
      {loading && (
        <div className="preloader-container">
          {/* اسم المتجر بالهوية الجديدة DARAJATI */}
          <motion.div 
            className="preloader-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <h1 className="preloader-brand-text">DARAJATI</h1>
          </motion.div>

          {/* شرائط الكشف المتحركة (Stairs Effect) */}
          <div className="stairs-wrapper">
            {stairSteps.map((step, index) => (
              <motion.div
                key={step}
                className="stair-step"
                initial={{ y: 0 }}
                exit={{ 
                  y: "-100%",
                  transition: { 
                    duration: 0.7, 
                    delay: index * 0.08, // تتابع حركي متسلسل للشرائط
                    ease: [0.77, 0, 0.175, 1] 
                  } 
                }}
              />
            ))}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}