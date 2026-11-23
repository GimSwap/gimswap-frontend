import Link from 'next/link';

interface GradientButtonProps {
  children: React.ReactNode;
  href: string;
}

export default function GradientButton({
  children,
  href,
}: GradientButtonProps) {
  return (
    <Link
      href={href}
      className="mb-4 bg-purple-50 rounded-lg relative z-0 docs-gradient overflow-hidden w-full h-[36px] flex items-center justify-center border-purple-500"
    >
      <section className="docs-gradient-inner px-4 w-[calc(100%-2px)] z-10 h-[calc(100%-2px)] bg-purple-50 rounded-[7px] grid place-items-center">
        {children}
      </section>
    </Link>
  );
}
