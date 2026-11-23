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
  chevronClassName = 'stroke-black-6',
}: AccordionProps) {
  const [open, setOpen] = useState<boolean>(!!opened);
  return (
    <section
      className={`pt-1 transition-max-height duration-100 ease-in-out overflow-hidden ${className}`}
    >
      <div
        className={`flex items-center justify-between mb-2 cursor-pointer p1 font-medium ${titleClassName}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {title}
        <ChevronUpIcon
          className={`${open ? 'rotate-180' : 'rotate-90'} ${chevronClassName} min-w-5`}
        />
      </div>
      <div
        style={{
          maxHeight: open ? '2500px' : '0px',
          opacity: open ? '1' : '0',
        }}
        className="transition-max-height duration-100 ease-in-out"
      >
        {children}
      </div>
    </section>
  );
}
