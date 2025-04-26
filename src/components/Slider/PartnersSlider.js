import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import styles from './PartnersSlider.module.css';

const PartnersSlider = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [visibleSlides, setVisibleSlides] = useState(4);
  const x = useMotionValue(0);

  const partners = [
    { id: 1, name: 'Nike', logo: 'https://i.pinimg.com/originals/6f/67/8f/6f678f287fac6edcde382eb082804b9d.jpg' },
    { id: 2, name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Adidas_2022_logo.svg/1599px-Adidas_2022_logo.svg.png' },
    { id: 3, name: 'Puma', logo: 'https://i.pinimg.com/originals/fd/b5/a1/fdb5a17b628381b79e2ee531b2310031.png' },
    { id: 4, name: 'Reebok', logo: 'https://vectorseek.com/wp-content/uploads/2021/01/Reebok-Logo-Vector.jpg' },
    { id: 5, name: 'New Balance', logo: 'https://avatars.mds.yandex.net/i?id=ebb30545a2e10a6d11e62d36bda26cc24f4d05b5-12729258-images-thumbs&n=13' },
    { id: 6, name: 'Under Armour', logo: 'https://avatars.mds.yandex.net/i?id=446e6ba82cdacb18ae6b03bc351215d9_l-12544737-images-thumbs&n=13' },
    { id: 7, name: 'Asics', logo: 'https://avatars.mds.yandex.net/i?id=1b0c6f55b45d126510df4e2ee146c79798aa3847-5305607-images-thumbs&n=13' },
  ];

  const slideWidth = 160;
  const maxIndex = partners.length - visibleSlides;

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      setVisibleSlides(isNowMobile ? 2 : 6);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const snapToIndex = (index) => {
    const newX = -index * slideWidth;
    animate(x, newX, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    });
  };

  const handleDragEnd = (_, info) => {
    const currentX = x.get();
    const rawIndex = -currentX / slideWidth;
    const newIndex = Math.round(rawIndex);

    const clampedIndex = Math.max(0, Math.min(newIndex, maxIndex));
    snapToIndex(clampedIndex);
  };

  const handlePrev = () => {
    const currentX = x.get();
    const currentIndex = Math.round(-currentX / slideWidth);
    const newIndex = Math.max(currentIndex - 1, 0);
    snapToIndex(newIndex);
  };

  const handleNext = () => {
    const currentX = x.get();
    const currentIndex = Math.round(-currentX / slideWidth);
    const newIndex = Math.min(currentIndex + 1, maxIndex);
    snapToIndex(newIndex);
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderWrapper}>
        {/* {!isMobile && (
          <button
            className={`${styles.arrowButton} ${styles.arrowLeft}`}
            onClick={handlePrev}
            aria-label="Previous"
          >
            ◀
          </button>
        )} */}

        <motion.div className={styles.sliderViewport} whileTap={{ cursor: 'grabbing' }}>
          <motion.div
            className={styles.sliderTrack}
            style={{ x }}
            drag="x"
            dragConstraints={{
              left: -slideWidth * maxIndex,
              right: 0,
            }}
            dragElastic={0.1}
            dragMomentum={true}
            onDragEnd={handleDragEnd}
          >
            {partners.map((partner) => (
              <motion.div
                key={partner.id}
                className={styles.slide}
                whileHover={{ scale: 1.05 }}
              >
                <div className={styles.partnerLogo}>
                  <img src={partner.logo} alt={partner.name} className={styles.logoImage} />
                  <span className={styles.logoName}>{partner.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* {!isMobile && (
          <button
            className={`${styles.arrowButton} ${styles.arrowRight}`}
            onClick={handleNext}
            aria-label="Next"
          >
            ▶
          </button>
        )} */}
      </div>
    </div>
  );
};

export default PartnersSlider;
