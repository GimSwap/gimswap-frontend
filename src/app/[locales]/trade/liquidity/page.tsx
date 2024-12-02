'use client';

import Image from 'next/image';
import gear from '@/src/assets/image/gear.webp';
import Button from '@/src/components/Button';
import LinkButton from './_components/LinkButton';
import { DEX_LIST } from '@/src/lib/constants/dex';
import ContentBox from '../_components/ContentBox';

export default function Liquidity() {
  return (
    <ContentBox>
      <section className="flex flex-col items-center">
        <Image src={gear} alt="Gear" className="w-[114px] h-auto mt-7" />
        <h5 className="font-medium text-black-8 text-center py-3">
          Prepare for Simple KRWO Liquidity
          <br />
          Pool Management Feature.
        </h5>
        <Button
          title="Coming Soon"
          disabled
          className="text-black-1 my-4 mb-6 text-h4"
        />
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
