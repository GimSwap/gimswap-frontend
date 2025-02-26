import Accordion from '@/src/components/Accordion';
import { getTranslations } from 'next-intl/server';

export default async function Warning() {
  const t = await getTranslations('quickDeposit.warning');
  const warnings = [
    t('warning1'),
    t('warning2'),
    t('warning3'),
    t('warning4'),
    t('warning5'),
    t('warning6'),
    t('warning7'),
    t('warning8'),
    t('warning9'),
  ];
  return (
    <Accordion
      title={t('title')}
      className="!py-4"
      titleClassName="text-h4 !font-bold px-6"
      chevronClassName="stroke-black-6 w-6 h-6"
    >
      <div className="p-6 bg-black-3">
        {warnings.map((warning) => (
          <p
            key={warning}
            className="p1 text-black-8 before:content-['•'] before:mr-2"
          >
            {warning}
          </p>
        ))}
      </div>
    </Accordion>
  );
}
