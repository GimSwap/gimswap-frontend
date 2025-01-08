import { useEffect, useState } from 'react';

const opacity = [1, 0.8, 0.5];

export default function ButtonLoading() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev - 1 + opacity.length) % opacity.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-row gap-2">
      {opacity.map((_, index) => (
        <div
          key={index}
          className="w-[6px] h-[6px] bg-black-1 rounded-full"
          style={{
            opacity: opacity[(activeIndex + index) % opacity.length],
          }}
        />
      ))}
    </div>
  );
}
