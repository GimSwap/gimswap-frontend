import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { CTA_ITEMS } from '@/src/app/[locales]/_components/KeyVisualSlider/types';

interface UseDesktopSliderProps {
  items?: typeof CTA_ITEMS;
  loop?: boolean;
  slideAnimationDuration?: number;
}

export function useDesktopSlider({
  items = CTA_ITEMS,
  loop = true,
  slideAnimationDuration = 300,
}: UseDesktopSliderProps = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = items.length;
  const sliderRef = useRef<HTMLDivElement>(null);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return loop ? totalItems - 1 : 0;
      }
      return prevIndex - 1;
    });
  }, [totalItems, loop]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === totalItems - 1) {
        return loop ? 0 : prevIndex;
      }
      return prevIndex + 1;
    });
  }, [totalItems, loop]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalItems) {
        setCurrentIndex(index);
      }
    },
    [totalItems],
  );

  const visibleItems = useMemo(() => {
    return [items[currentIndex]];
  }, [items, currentIndex]);

  const isFirst = currentIndex === 0;

  const isLast = currentIndex === totalItems - 1;

  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.parentElement?.offsetWidth || 0;
      sliderRef.current.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      sliderRef.current.style.transition = `transform ${slideAnimationDuration}ms ease-in-out`;
    }
  }, [currentIndex, slideAnimationDuration]);

  const getSliderStyles = useCallback(() => {
    return {
      display: 'flex',
      width: `${totalItems * 100}%`,
      transition: `transform ${slideAnimationDuration}ms ease-in-out`,
    };
  }, [totalItems, slideAnimationDuration]);

  const getSlideItemStyles = useCallback(() => {
    return {
      width: `${100 / totalItems}%`,
    };
  }, [totalItems]);

  return {
    currentIndex,
    visibleItems,
    goToPrev,
    goToNext,
    goToIndex,
    isFirst,
    isLast,
    totalItems,
    sliderRef,
    getSliderStyles,
    getSlideItemStyles,
  };
}
