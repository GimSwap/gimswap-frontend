import FAQ from './_components/FAQ';
import HowToUse from './_components/howToUse/HowToUse';
import Intro from './_components/intro/Intro';
import SelectLanguageBar from './_components/SelectLanguageBar';
import Warning from './_components/Warning';
import { OFFICIAL_EMAIL } from '@/src/lib/constants/officialInformation';
import QuickDepositButton from './_components/QuickDepositButton';
import { getLocale, getTranslations } from 'next-intl/server';
import Event from './_components/event/Event';
import {
  fetchGetEventExpired,
  fetchGetQuickDepositEventNotice,
} from '@/src/lib/utils/api/fetchGetQuickDepositEventNotice';

export default async function QuickDeposit() {
  const t = await getTranslations('quickDeposit');
  const locale = await getLocale();
  const notices = await fetchGetQuickDepositEventNotice(locale);
  const eventExpired = await fetchGetEventExpired();

  return (
    <main className="mx-auto relative">
      <SelectLanguageBar />
      <div className="max-w-[560px] mx-auto relative">
        <section className="mx-auto min-h-[calc(100dvh-116px)] max-h-[calc(100dvh-116px)] overflow-scroll pb-[116px] scrollbar-hide">
          <Event notices={notices} eventExpired={eventExpired} />
          <Intro />
          <HowToUse />
          <Warning />
          <FAQ />
          <section className="py-4 px-6 flex flex-col gap-1">
            <h4 className="font-bold">{t('cs')}</h4>
            <p className="p1">{OFFICIAL_EMAIL}</p>
          </section>
        </section>
        <QuickDepositButton />
      </div>
    </main>
  );
}
