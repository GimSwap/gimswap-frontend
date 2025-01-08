import { DEX_LIST } from '@/src/lib/constants/dex';
import LinkButton from '../../_components/LinkButton';

export default function DexLink() {
  return (
    <section className="p-4 rounded-lg z-10 bg-black-1 relative mt-3 shadow-customShadow">
      <h5 className="font-bold pb-4">Link</h5>
      <div className="flex flex-col gap-2 w-full">
        {DEX_LIST.map((item) => (
          <LinkButton
            key={item.name}
            icon={item.icon}
            title={item.name}
            subtitle={item.subtitle}
            href={item.href}
          />
        ))}
      </div>
    </section>
  );
}
