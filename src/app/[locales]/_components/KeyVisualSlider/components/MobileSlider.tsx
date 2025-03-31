import { useMobileSlider } from '@/src/app/[locales]/_components/KeyVisualSlider/hooks';
import { CTA_ITEMS } from '../types';
import SliderItem from './SliderItem';

export default function MobileSlider() {
  const {
    sliderRef,
    itemRef,

    getVisibleItems,
    getItemClass,
    getPosition,

    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useMobileSlider({ itemCount: CTA_ITEMS.length });

  return (
    <div className="relative w-[808px] overflow-hidden" role="region">
      <div className="flex w-full items-center justify-center gap-4 pt-4">
        <div
          className="relative flex gap-4 overflow-visible"
          aria-live="polite"
        >
          <div
            ref={sliderRef}
            className={`flex gap-4 py-4 transition-all duration-300 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ minHeight: '150px' }}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragCancel}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
            onTouchCancel={handleDragCancel}
          >
            {getVisibleItems().map((item, i) => {
              const position = getPosition(i);
              return (
                <div
                  key={`slide-${item.index}-${i}`}
                  className={getItemClass(position)}
                  ref={i === 1 ? itemRef : null}
                  aria-hidden={position !== 'current'}
                  role={position === 'current' ? 'group' : undefined}
                  aria-roledescription={
                    position === 'current' ? 'slide' : undefined
                  }
                  aria-label={
                    position === 'current'
                      ? `슬라이드 ${item.index + 1}/${CTA_ITEMS.length}`
                      : undefined
                  }
                  data-position={position}
                >
                  <SliderItem item={CTA_ITEMS[item.index]} type="mobile" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
