import { GIMSWAP_CERTIK_URL, GIMSWAP_DOCS_URL } from '@/src/lib/constants/url';
import Link from 'next/link';
import CertikIcon from '@/public/svg/social/certik.svg';

const OUT_LINKS = [
  {
    title: 'DOCS',
    href: GIMSWAP_DOCS_URL,
    className: 'border border-black-8 text-black-8 bg-black-1',
  },
  {
    Icon: CertikIcon,
    title: 'Audit by CERTIK',
    href: GIMSWAP_CERTIK_URL,
    className: 'text-black-1 bg-black-8',
  },
];

export default function OutLink() {
  return (
    <section className="flex flex-row flex-nowrap items-center gap-2">
      {OUT_LINKS.map(({ href, title, Icon, className }) => (
        <Link href={href} key={title} target="_blank">
          <div
            className={`p1 font-medium flex flex-row items-center gap-1 py-[6px] px-3 rounded-full ${className}`}
          >
            {Icon && <Icon />}
            {title}
          </div>
        </Link>
      ))}
    </section>
  );
}
