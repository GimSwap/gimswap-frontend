import Accordion from '@/src/components/Accordion';

import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import PopupButton from './PopupButton';

const IMAGE_URL =
  'https://objectstorage.kr-central-2.kakaocloud.com/v1/09a3dddee74c48fc8fffcb1d0240b227/gimswap-dev';

export default async function HowToUse() {
  const t = await getTranslations('quickDeposit');
  const locale = await getLocale();
  const howToUse = [
    {
      title: t('howToUse.step1'),
      image: 'connectWallet',
      help: (
        <PopupButton type="createBinanceWallet">
          {t('howToUse.step1Help')}
        </PopupButton>
      ),
    },
    { title: t('howToUse.step2'), image: 'enterAnAmount' },
    {
      title: t('howToUse.step3'),
      image: 'buyOV',
      help: (
        <p className="p1 text-black-7 text-center">{t('howToUse.step3Help')}</p>
      ),
    },
    { title: t('howToUse.step4'), image: 'sendUSDT' },
    {
      title: t('howToUse.step5'),
      image: 'receiveUSDT',
      help: (
        <PopupButton type="swapUSDT">{t('howToUse.step5Help')}</PopupButton>
      ),
    },
  ];

  return (
    <Accordion
      title={t('howToUse.title')}
      className="pt-6"
      titleClassName="text-h4 !font-bold px-6 py-4"
      chevronClassName="stroke-black-6 w-6 h-6"
      opened
    >
      <div className="flex flex-col gap-8 px-6">
        {howToUse.map((item, index1) => (
          <div key={item.title} className="flex flex-col gap-2">
            <h5 className="font-medium text-black-8">{`${index1 + 1}. ${item.title}`}</h5>
            <section className="flex justify-center items-center bg-black-3 rounded-lg">
              <Image
                src={`${IMAGE_URL}/${locale}/transfer/usage/${item.image}.webp`}
                alt={item.image}
                width={190}
                height={162}
              />
            </section>
            {item.help}
          </div>
        ))}
      </div>
    </Accordion>
  );
}
