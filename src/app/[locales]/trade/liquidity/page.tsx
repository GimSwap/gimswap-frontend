import Image from 'next/image';
import gear from '@/src/assets/image/gear.webp';
import Button from '@/src/components/Button';
import LinkButton from './_components/LinkButton';
import { DEX_LIST } from '@/src/lib/constants/dex';
import ContentBox from '../_components/ContentBox';
import { redirect } from '@/src/i18n/routing';
import { setRequestLocale } from 'next-intl/server';

export default function Liquidity({
  params: { locales },
}: {
  params: { locales: string };
}) {
  redirect({ href: '/trade/liquidity/recommend', locale: locales });

  setRequestLocale(locales);

  return (
    <ContentBox>
      <section className="flex flex-col items-center">
        <Image src={gear} alt="Gear" className="w-[114px] h-auto mt-7" />
        <h5 className="font-medium text-black-8 text-center py-3">
          Prepare for Simple KRWO Liquidity
          <br />
          Pool Management Feature.
        </h5>
        <Button disabled className="mt-4 mb-6" color="primary" size="xl">
          Coming Soon
        </Button>
        <h3 className="font-bold text-start w-full mb-4">Link</h3>
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
    </ContentBox>
  );
}
