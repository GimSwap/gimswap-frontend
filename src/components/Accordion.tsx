"use client";

import { useState } from "react";
import ChevronUpIcon from "@/public/svg/chevron/up.svg";

interface AccordionProps {
  title?: string;
  children?: React.ReactNode;
}

export default function Accordion({ title, children }: AccordionProps) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <section
      className="pt-1 transition-all duration-200 ease-in-out overflow-hidden"
      onClick={() => setOpen((prev) => !prev)}
    >
      <div className="flex items-center justify-between mb-2 cursor-pointer">
        <p className="font-medium">{title}</p>
        <ChevronUpIcon
          className={`${open ? "rotate-180" : "rotate-0"} min-w-5`}
        />
      </div>
      <div
        style={{ maxHeight: open ? "500px" : "0px" }}
        className="transition-max-height duration-200 ease-in-out"
      >
        {children}
      </div>
    </section>
  );
}
