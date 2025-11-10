import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";

import styles from './Carousel.module.css';

const Carousel = ({ 
  title,
  bg,
  children, 
  show = { xl: 4, l: 3, md: 2, sm: 1 },
  gap = 16,
  autoPlay = false,
  autoPlayInterval = 3000,
  sidePadding = 20, // New prop to control side spacing
  navButtonOffset = 10 // New prop to control how far buttons are from edges
}) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [cardsToShow, setCardsToShow] = useState(1);
  const [cardWidth, setCardWidth] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  const items = React.Children.toArray(children);
  const totalItems = items.length;

  // Always use infinite loop - clone items for seamless looping
  const clonedItems = [
    ...items.slice(-cardsToShow),
    ...items,
    ...items.slice(0, cardsToShow)
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

  // Calculate card width (accounting for side padding)
  const calculateCardWidth = useCallback(() => {
    if (!carouselRef.current) return 0;
    const containerWidth = carouselRef.current.offsetWidth - (sidePadding * 2);
    const totalGap = gap * (cardsToShow - 1);
    return (containerWidth - totalGap) / cardsToShow;
  }, [cardsToShow, gap, sidePadding]);

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

    if (currentIndex >= totalItems + cardsToShow) {
      timeoutId = setTimeout(() => {
        setIsTransitionEnabled(false);
        setCurrentIndex(cardsToShow);
        setTimeout(() => setIsTransitionEnabled(true), 50);
      }, 500);
    }
    else if (currentIndex <= 0) {
      timeoutId = setTimeout(() => {
        setIsTransitionEnabled(false);
        setCurrentIndex(totalItems + cardsToShow - 1);
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

  // Calculate transform value (accounting for side padding)
  const transformValue = -currentIndex * (cardWidth + gap) + sidePadding;

  return (
    <div 
      className={`${styles.carouselContainer} ${bg}`}
      ref={carouselRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        paddingLeft: `${sidePadding}px`,
        paddingRight: `${sidePadding}px`
      }}
    >
       {title && <h2 className='text-3xl font-semibold my-5 pl-10'>{title}</h2>}
      <div 
        className={`${styles.carouselTrack}`}
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
            style={{ left: `${navButtonOffset}px` }}
          >
            <FaArrowLeftLong className='text-blue-500'/>
          </button>
          <button 
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={nextSlide}
            aria-label="Next slide"
            style={{ right: `${navButtonOffset}px` }}
          >
            <FaArrowRightLong className='text-blue-500'/>
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;