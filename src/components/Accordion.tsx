'use client';

import React, { useState } from 'react';
import ChevronUpIcon from '@/public/svg/chevron/up.svg';

interface AccordionProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  opened?: boolean;
  className?: string;
  titleClassName?: string;
  chevronClassName?: string;
}

export default function Accordion({
  title,
  children,
  opened,
  className,
  titleClassName,
  chevronClassName = 'stroke-black-12',
}: AccordionProps) {
  const [open, setOpen] = useState<boolean>(!!opened);
  return (
    <section
      className={`pt-1 transition-max-height duration-200 ease-in-out overflow-hidden ${className}`}
      onClick={() => setOpen((prev) => !prev)}
    >
      <div
        className={`flex items-center justify-between mb-2 cursor-pointer ${titleClassName}`}
      >
        <div className="p1 font-medium">{title}</div>
        <ChevronUpIcon
          className={`${open ? 'rotate-0' : 'rotate-180'} ${chevronClassName} min-w-5`}
        />
      </div>
      <div
        style={{
          maxHeight: open ? '500px' : '0px',
          opacity: open ? '1' : '0',
        }}
        className="transition-max-height duration-200 ease-in-out"
      >
        {children}
      </div>
    </section>
  );
}
