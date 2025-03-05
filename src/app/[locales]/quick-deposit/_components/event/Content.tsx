import { useTranslations } from 'next-intl';

interface ContentProps {
  notices: Record<string, string>;
}

export default function Content({ notices }: ContentProps) {
  const t = useTranslations('quickDeposit.event.content');

  return (
    <section className="flex flex-col bg-black-1 pt-6 w-full rounded-lg mt-2">
      <section className="px-4">
        <div className="flex flex-row justify-between items-center">
          <h4 className="font-bold">Mission</h4>
          <p className="c1 font-bold text-black-7">{t('doNotDuplicate')}</p>
        </div>
        <hr className="my-3 w-full border-black-5" />
        <section className="flex flex-row gap-2 mb-3">
          <p className="p1 rounded-full px-2 py-1 bg-black-4 text-black-7 w-fit h-[24px] flex items-center justify-center text-nowrap">
            {t('content')}
          </p>
          <p className="p1">{t('contentDescription')}</p>
        </section>
        <section className="flex flex-row gap-2 items-center pb-6">
          <p className="p1 rounded-full px-2 py-1 bg-black-4 text-black-7 w-fit h-[24px] flex items-center justify-center text-nowrap">
            {t('reward')}
          </p>
          <p className="p1 font-bold">
            {t.rich('rewardDescription', {
              span: (chunks) => (
                <span className="text-purple-500">{chunks}</span>
              ),
            })}
          </p>
        </section>
      </section>
      <section className="flex flex-col bg-black-3 p-4 rounded-b-lg">
        <p className="p1 font-bold pb-2 text-start">{t('notice')}</p>
        {notices &&
          Object.entries(notices).map(([key, value]) => (
            <p
              className="c1 before:content-['•'] before:font-bold text-black-8 before:absolute before:text-black-8 pl-4 before:-translate-x-[10px] relative"
              key={key}
            >
              {value}
            </p>
          ))}
      </section>
    </section>
  );
}
