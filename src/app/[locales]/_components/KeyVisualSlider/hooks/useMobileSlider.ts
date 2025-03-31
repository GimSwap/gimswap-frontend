import { useCallback, useState, useRef, useEffect } from 'react';
import {
  animationClassMap,
  baseClassMap,
  Position,
  positionMap,
} from '../types';
import { debounce, updateAnimationStyles } from '../utils';

const GAP_WIDTH = 16;

type SlideItem = {
  index: number;
  position: Position;
};

export interface UseMobileSliderProps {
  itemCount: number;
  autoplayInterval?: number;
  initialAutoplay?: boolean;
}

export function useMobileSlider({
  itemCount,
  autoplayInterval = 3000,
  initialAutoplay = true,
}: UseMobileSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(
    null,
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleItems, setVisibleItems] = useState<SlideItem[]>([]);
  const [dragStartX, setDragStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [autoplay, setAutoplay] = useState(initialAutoplay);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const dragThreshold = 10;

  const sliderRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const containerWidth = useRef(0);

  const calculateItemWidth = useCallback(() => {
    if (itemRef.current) {
      containerWidth.current = itemRef.current.clientWidth + GAP_WIDTH;
      updateAnimationStyles(containerWidth.current);
    }
  }, []);

  const calculateVisibleItems = useCallback(() => {
    const visibleCount = 5;
    const halfCount = Math.floor(visibleCount / 2);

    const items: SlideItem[] = [];

    for (let i = -halfCount; i <= halfCount; i++) {
      const rawIndex = (currentIndex + i + itemCount) % itemCount;
      const position = positionMap[i + halfCount] as Position;

      items.push({ index: rawIndex, position });
    }

    setVisibleItems(items);
    return items;
  }, [currentIndex, itemCount]);

  useEffect(() => {
    calculateItemWidth();
    calculateVisibleItems();

    const handleResize = debounce(() => {
      calculateItemWidth();
    }, 200);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      const styleEl = document.getElementById('carousel-keyframes');
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, [calculateItemWidth, calculateVisibleItems]);

  const moveSlide = useCallback(
    (direction: 'left' | 'right', newIndex: number) => {
      if (isAnimating) return;

      setIsAnimating(true);
      setSlideDirection(direction);

      setTimeout(() => {
        setCurrentIndex(newIndex);
        setIsAnimating(false);
        setSlideDirection(null);
      }, 500);
    },
    [currentIndex, isAnimating, isDragging],
  );

  const handlePrev = useCallback(() => {
    const newIndex = currentIndex === 0 ? itemCount - 1 : currentIndex - 1;
    moveSlide('right', newIndex);
  }, [currentIndex, itemCount, moveSlide]);

  const handleNext = useCallback(() => {
    const newIndex = currentIndex === itemCount - 1 ? 0 : currentIndex + 1;
    moveSlide('left', newIndex);
  }, [currentIndex, itemCount, moveSlide]);

  const getVisibleItems = useCallback(() => {
    return visibleItems.length > 0 ? visibleItems : calculateVisibleItems();
  }, [visibleItems, calculateVisibleItems]);

  const getItemClass = useCallback(
    (position: Position) => {
      const baseClass = baseClassMap[position] || '';

      if (!isAnimating || !slideDirection) return baseClass;

      const animationClass =
        (slideDirection && animationClassMap[slideDirection][position]) || '';

      return `${baseClass} ${animationClass}`;
    },
    [isAnimating, slideDirection],
  );

  const getPosition = useCallback((i: number): Position => {
    return positionMap[i] || 'current';
  }, []);

  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (isAnimating) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      setDragStartX(clientX);
      setIsDragging(true);
    },
    [isAnimating],
  );

  const handleDragEnd = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging) return;

      const clientX =
        'touches' in e
          ? e.changedTouches && e.changedTouches.length > 0
            ? e.changedTouches[0].clientX
            : dragStartX
          : e.clientX;

      const dragDistance = clientX - dragStartX;

      if (Math.abs(dragDistance) > dragThreshold) {
        if (dragDistance > 0) {
          handlePrev();
        } else {
          handleNext();
        }
      }

      setIsDragging(false);
    },
    [dragStartX, handleNext, handlePrev, isDragging],
  );

  const handleDragCancel = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const toggleAutoplay = useCallback(() => {
    setAutoplay((prev) => !prev);
  }, []);

  useEffect(() => {
    if (autoplay && !isDragging && !isAnimating) {
      const timer = setTimeout(() => {
        handleNext();
      }, autoplayInterval);

      autoplayTimerRef.current = timer;

      return () => {
        if (autoplayTimerRef.current) {
          clearTimeout(autoplayTimerRef.current);
          autoplayTimerRef.current = null;
        }
      };
    }
  }, [
    autoplay,
    isDragging,
    isAnimating,
    currentIndex,
    handleNext,
    autoplayInterval,
  ]);

  return {
    currentIndex,
    sliderRef,
    itemRef,
    handlePrev,
    handleNext,
    getVisibleItems,
    getItemClass,
    getPosition,
    isAnimating,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    autoplay,
    toggleAutoplay,
  };
}
