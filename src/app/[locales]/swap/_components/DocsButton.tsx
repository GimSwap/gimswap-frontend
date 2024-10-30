import Link from 'next/link';
import LampIcon from '@/public/svg/lamp.svg';
import ChevronRightIcon from '@/public/svg/chevron/right.svg';

export default function DocsButton() {
  return (
    <Link
      href="https://docs.gimswap.com/gimswap-guide/how-to-get-krwo"
      target="_blank"
      className="mb-6 bg-purple-50 rounded-full relative z-0 docs-gradient overflow-hidden w-[196px] h-[36px] flex items-center justify-center border-purple-500"
    >
      <section className="docs-gradient-inner flex w-[193.5px] z-10  h-[33.5px] justify-center items-center bg-purple-50 rounded-full">
        <LampIcon />
        <p className="p1 font-medium text-purple-500 ml-1 mr-2 rounded-[inherit] bg-purple-50 whitespace-nowrap">
          How to Get KRWO
        </p>
        <ChevronRightIcon />
      </section>
    </Link>
  );
}
