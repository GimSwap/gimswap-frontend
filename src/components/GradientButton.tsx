import Link from 'next/link';
import ChevronRightIcon from '@/public/svg/chevron/right.svg';

interface GradientButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function GradientButton({
  href,
  children,
}: GradientButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      className="my-4 bg-purple-50 rounded-full relative z-0 docs-gradient overflow-hidden w-full h-[36px] flex items-center justify-center border-purple-500"
    >
      <section className="docs-gradient-inner px-4 flex w-[calc(100%-1.8px)] z-10 h-[33.5px] justify-between items-center bg-purple-50 rounded-full">
        <div className="flex flex-row">{children}</div>
        <ChevronRightIcon className="stroke-purple-500" />
      </section>
    </Link>
  );
}
