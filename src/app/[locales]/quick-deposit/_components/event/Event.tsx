'use client';

import Lottie from 'lottie-react';
import bellLottie from '@/public/lottie/bell.json';
import { useState } from 'react';
import ChevronDownIcon from '@/public/svg/chevron/down.svg';
import Content from './Content';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';

interface EventProps {
  notices: Record<string, string>;
  eventExpired: Record<string, string>;
}

export default function Event({ notices, eventExpired }: EventProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('quickDeposit.event');

  const isExpired = dayjs(Object.values(eventExpired)[0]).isBefore(dayjs());

  if (isExpired) return null;

  return (
    <section className="bg-black-12 p-6 flex flex-col justify-center items-center gap-4">
      <section className="flex flex-col gap-1 items-center">
        <Lottie
          animationData={bellLottie}
          loop={false}
          className="h-[24px] w-6"
        />
        <h2 className="font-bold bg-[linear-gradient(90deg,#FFF_0%,#CDBBFF_100%);] bg-clip-text text-[transparent] text-center">
          {t('title')}
        </h2>
        <p className="font-medium text-black-1 text-center">{t('subtitle')}</p>
      </section>
      {isOpen && <Content notices={notices} />}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="py-3 px-6 flex flex-row gap-1 items-center bg-black-10 rounded-lg w-full justify-center"
      >
        <p className="p1 font-medium text-black-1">
          {isOpen ? t('button.fold') : t('button.open')}
        </p>
        <ChevronDownIcon
          className={`w-4 h-4 stroke-black-1 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
    </section>
  );
}
