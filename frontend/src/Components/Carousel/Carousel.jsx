import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import styles from './Carousel.module.css';

const Carousel = ({ 
  children, 
  show = { xl: 4, l: 3, md: 2, sm: 1 },
  gap = 16,
  autoPlay = false,
  autoPlayInterval = 3000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 because of cloned items
  const [cardsToShow, setCardsToShow] = useState(1);
  const [cardWidth, setCardWidth] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  const items = React.Children.toArray(children);
  const totalItems = items.length;

  // Always use infinite loop - clone items for seamless looping
  const clonedItems = [
    ...items.slice(-cardsToShow), // Clone last items for beginning
    ...items,                     // Original items
    ...items.slice(0, cardsToShow) // Clone first items for end
  ];

  const totalClonedItems = clonedItems.length;

  // Calculate responsive cards to show
  const calculateResponsiveShow = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1200) return show.xl || 4;
    if (width >= 992) return show.l || 3;
    if (width >= 768) return show.md || 2;
    return show.sm || 1;
  }, [show]);

  // Calculate card width
  const calculateCardWidth = useCallback(() => {
    if (!carouselRef.current) return 0;
    const containerWidth = carouselRef.current.offsetWidth;
    const totalGap = gap * (cardsToShow - 1);
    return (containerWidth - totalGap) / cardsToShow;
  }, [cardsToShow, gap]);

  // Handle responsive updates
  useEffect(() => {
    const updateResponsive = () => {
      const newCardsToShow = Math.min(calculateResponsiveShow(), totalItems);
      setCardsToShow(newCardsToShow);
    };

    updateResponsive();
    window.addEventListener('resize', updateResponsive);
    
    return () => window.removeEventListener('resize', updateResponsive);
  }, [calculateResponsiveShow, totalItems]);

  // Update card width
  useEffect(() => {
    const updateCardWidth = () => {
      const width = calculateCardWidth();
      setCardWidth(width);
    };

    updateCardWidth();
    const resizeObserver = new ResizeObserver(updateCardWidth);
    if (carouselRef.current) {
      resizeObserver.observe(carouselRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [calculateCardWidth]);

  // Handle infinite loop transitions
  useEffect(() => {
    if (totalItems <= 1) return;

    let timeoutId;

    // If we're at the last cloned item (which is same as first original), jump to first original
    if (currentIndex >= totalItems + cardsToShow) {
      timeoutId = setTimeout(() => {
        setIsTransitionEnabled(false);
        setCurrentIndex(cardsToShow); // Jump to first original item
        setTimeout(() => setIsTransitionEnabled(true), 50);
      }, 500);
    }
    // If we're at the first cloned item (which is same as last original), jump to last original
    else if (currentIndex <= 0) {
      timeoutId = setTimeout(() => {
        setIsTransitionEnabled(false);
        setCurrentIndex(totalItems + cardsToShow - 1); // Jump to last original item
        setTimeout(() => setIsTransitionEnabled(true), 50);
      }, 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentIndex, totalItems, cardsToShow]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || totalItems <= 1) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex(prev => prev + 1);
    }, autoPlayInterval);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, totalItems]);

  // Navigation
  const nextSlide = useCallback(() => {
    if (totalItems <= 1) return;
    setCurrentIndex(prev => prev + 1);
  }, [totalItems]);

  const prevSlide = useCallback(() => {
    if (totalItems <= 1) return;
    setCurrentIndex(prev => prev - 1);
  }, [totalItems]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (autoPlay && totalItems > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => prev + 1);
      }, autoPlayInterval);
    }
  };

  if (totalItems === 0) return null;

  // Calculate transform value
  const transformValue = -currentIndex * (cardWidth + gap);

  return (
    <div 
      className={styles.carouselContainer}
      ref={carouselRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={styles.carouselTrack}
        style={{
          transform: `translateX(${transformValue}px)`,
          transition: isTransitionEnabled ? 'transform 0.5s ease-in-out' : 'none',
          gap: `${gap}px`
        }}
      >
        {clonedItems.map((item, index) => (
          <div
            key={index}
            className={styles.carouselItem}
            style={{
              minWidth: `${cardWidth}px`,
              maxWidth: `${cardWidth}px`
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {totalItems > 1 && (
        <>
          <button 
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <FaChevronLeft/>
          </button>
          <button 
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <FaChevronRight/>
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;