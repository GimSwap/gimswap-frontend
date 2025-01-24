'use client';

import { DEX_LIST } from '@/src/lib/constants/dex';
import LinkButton from '../../_components/LinkButton';
import { useAccount } from 'wagmi';
import { ChainIdType } from '@/src/lib/types/ChainIdType';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { useState } from 'react';
import ChevronDownIcon from '@/public/svg/chevron/down.svg';

const STEP_COUNT = 3;

export default function DexLink() {
  const { chainId, isConnected } = useAccount();
  const [index, setIndex] = useState(STEP_COUNT);

  const filteredDexList = DEX_LIST.filter((dex) => {
    if (!chainId || !checkIsAvailableChain(chainId) || !isConnected) return dex;
    return dex.chainId.includes(chainId as ChainIdType);
  });

  const handleExpand = () => {
    if (filteredDexList.length === index) {
      setIndex(Math.max(STEP_COUNT, index - STEP_COUNT));
    } else {
      setIndex(Math.min(filteredDexList.length, index + STEP_COUNT));
    }
  };

  return (
    <section className="p-4 rounded-lg z-10 bg-black-1 relative mt-3 shadow-customShadow">
      <h5 className="font-bold pb-4">Link</h5>
      <div className="flex flex-col gap-2 w-full">
        {filteredDexList.map((item, i) => (
          <div
            key={item.name}
            className={`transition-all duration-300 ${
              i < index
                ? 'opacity-100 max-h-20'
                : 'opacity-0 max-h-0 overflow-hidden'
            }`}
          >
            <LinkButton
              icon={item.icon}
              title={item.name}
              subtitle={item.subtitle}
              href={item.href}
            />
          </div>
        ))}
        {filteredDexList.length > STEP_COUNT && (
          <button
            className="flex flex-row gap-1 items-center justify-center pt-4"
            onClick={handleExpand}
          >
            <p className="p1 font-bold text-purple-500">
              {filteredDexList.length === index ? 'Fold' : 'More'}
            </p>
            <ChevronDownIcon
              className={`w-5 h-5 stroke-purple-500 ${
                filteredDexList.length === index ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>
    </section>
  );
}
