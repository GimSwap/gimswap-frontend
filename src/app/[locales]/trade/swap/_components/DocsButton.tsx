import Link from 'next/link';
import LampIcon from '@/public/svg/lamp.svg';
import ChevronRightIcon from '@/public/svg/chevron/right.svg';

export default function DocsButton() {
  return (
    <Link
      href="https://docs.gimswap.com/gimswap-guide/how-to-get-krwo"
      target="_blank"
      className="my-4 bg-purple-50 rounded-full relative z-0 docs-gradient overflow-hidden w-full h-[36px] flex items-center justify-center border-purple-500"
    >
      <section className="docs-gradient-inner px-4 flex w-[calc(100%-1.8px)] z-10 h-[33.5px] justify-between items-center bg-purple-50 rounded-full">
        <div className="flex flex-row">
          <LampIcon />
          <p className="p1 font-medium text-purple-500 ml-1 mr-2 rounded-[inherit] bg-purple-50 whitespace-nowrap">
            How to Get KRWO
          </p>
        </div>
        <ChevronRightIcon className="stroke-purple-500" />
      </section>
    </Link>
  );
}
