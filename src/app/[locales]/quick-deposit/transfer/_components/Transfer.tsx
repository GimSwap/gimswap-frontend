'use client';

import PopupPagination from '@/src/components/popups/PopupPagination';
import BuyOv from './BuyOv';
import { useState } from 'react';

const MAX_STEP = 2;

export default function Transfer() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <main className="pt-[72px] mx-auto relative max-w-[560px] scrollbar-hide">
      <section className="px-6 py-2 pb-4 flex flex-row gap-1">
        {Array.from({ length: MAX_STEP }).map((_, index) => (
          <div
            key={index}
            className="rounded-full h-[4px] w-5 bg-purple-500"
            style={{
              backgroundColor: currentIndex === index ? '#926CFF' : '#E4E7FD',
            }}
          />
        ))}
      </section>
      <PopupPagination
        initialComponent={{
          component: BuyOv,
        }}
        onPush={() => setCurrentIndex(currentIndex + 1)}
        onPop={() => setCurrentIndex(currentIndex - 1)}
      />
    </main>
  );
}
