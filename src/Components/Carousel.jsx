import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function Carousel({
  children,
  cardsToShow = 5,
  gap = 4,
  autoplay = false,
  interval = 4000,
}) {
  const total = React.Children.count(children);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  /* ---------- stable callbacks (avoid stale closures) ---------- */
  const next = useCallback(() => {
    setIndex((i) => {
      const n = i + 1;
      return n + cardsToShow > total ? 0 : n;
    });
  }, [total, cardsToShow]);

  const prev = useCallback(() => {
    setIndex((i) => {
      const p = i - 1;
      return p < 0 ? Math.max(total - cardsToShow, 0) : p;
    });
  }, [total, cardsToShow]);

  /* ---------- autoplay ---------- */
  useEffect(() => {
    if (!autoplay) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, interval);
    return () => clearInterval(intervalRef.current);
  }, [autoplay, interval, next]);

  /* ---------- drag/swipe ---------- */
  const dragStartX = useRef(null);
  const onPointerDown = (e) =>
    (dragStartX.current = e.clientX ?? e.touches[0].clientX);
  const onPointerUp = (e) => {
    const endX = e.clientX ?? e.changedTouches[0].clientX;
    const diff = dragStartX.current - endX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
  };

  /* ---------- gap & width maths ---------- */
  const gapRem = gap * 0.25;
  const cardWidth = 100 / cardsToShow;

  return (
    <div className="w-full select-none mt-10">
      {/* viewport */}
      <div
        className="relative overflow-hidden"
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
        onMouseUp={onPointerUp}
        onTouchEnd={onPointerUp}
      >
        {/* track */}
        {/* ---------- track ---------- */}
<div
  className="flex transition-transform duration-500 ease-out"
  style={{
    transform: `translateX(calc(-${index * cardWidth}% - ${index * gapRem}rem))`,
  }}
>
  {React.Children.map(children, (child, i) => (
    <div
      key={i}
      className="shrink-0"
      style={{
        flex: `0 0 calc(${cardWidth}% - ${gapRem}rem)`,   // same width for every card
        marginRight: `${gapRem}rem`,                      // keep margin on ALL cards
      }}
    >
      {child}
    </div>
  ))}
  {/* invisible spacer so last real card can slide fully into view */}
  <div
    className="shrink-0"
    style={{
      flex: `0 0 calc(${cardWidth}% - ${gapRem}rem)`,
      marginRight: 0,
      opacity: 0,
      pointerEvents: 'none',
    }}
  />
</div>
      </div>

      {/* arrows & counter */}
      <div className="flex items-center justify-between mt-4">
        <button onClick={prev} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <span className="text-sm text-gray-600">{index + 1} / {total}</span>
        <button onClick={next} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}