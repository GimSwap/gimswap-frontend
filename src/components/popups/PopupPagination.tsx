import { ComponentType, ComponentProps, useState } from 'react';

interface PaginationComponentType<T extends ComponentType<any>> {
  component: T;
  props?: Omit<ComponentProps<T>, 'next' | 'prev' | 'reset'>;
}

interface PopupPaginationProps<T extends ComponentType<any>> {
  initialComponent: PaginationComponentType<T>;
}

export type PaginationPushType = <T extends ComponentType<any>>(
  component: T,
  props?: Omit<ComponentProps<T>, 'next' | 'prev' | 'reset'>,
) => void;

const PAGINATION_TRANSITION_DURATION = 300;

export default function PopupPagination<T extends ComponentType<any>>({
  initialComponent,
}: PopupPaginationProps<T>) {
  const [history, setHistory] = useState<PaginationComponentType<any>[]>([
    initialComponent,
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pop = () => {
    if (history.length > 1) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setTimeout(() => {
        setHistory((prevHistory) => prevHistory.slice(0, -1));
      }, PAGINATION_TRANSITION_DURATION);
    }
  };

  const push: PaginationPushType = (component, props) => {
    setHistory((prevHistory) => [...prevHistory, { component, props }]);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const reset = () => {
    setHistory([initialComponent]);
    setCurrentIndex(0);
  };

  return (
    <section className="overflow-hidden">
      <div
        className={`flex transition-transform duration-${PAGINATION_TRANSITION_DURATION}`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {history.map(({ component: Component, props }, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <Component {...props} next={push} prev={pop} reset={reset} />
          </div>
        ))}
      </div>
    </section>
  );
}
