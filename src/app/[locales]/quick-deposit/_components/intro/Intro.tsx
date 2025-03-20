import { getTranslations } from 'next-intl/server';
import Step from './Step';
import ConvertIcon from './ConvertIcon';

export default async function Intro() {
  const t = await getTranslations('quickDeposit');

  const contents = [
    {
      title: t('intro.step-1.title'),
      description: t('intro.step-1.description'),
    },
    {
      title: t('intro.step-2.title'),
      description: t('intro.step-2.description'),
    },
    {
      title: t('intro.step-3.title'),
      description: t('intro.step-3.description'),
    },
  ];

  return (
    <section className="px-6 pt-8">
      <div className="mb-6 flex flex-row items-center justify-start gap-2 rounded-[50px] border border-purple-500 px-4 py-3">
        <span className="c1 rounded-[50px] bg-purple-50 px-[6px] py-[3px] text-purple-500">
          Event
        </span>
        <p className="p1 text-black-11">
          {t.rich('feeEvent.title', {
            b: (chunks) => <b>{chunks}</b>,
          })}
        </p>
      </div>
      <h5 className="font-medium text-purple-500">{t('title')}</h5>
      <h1 className="pt-2 font-bold">
        {t.rich('subTitle', {
          br: () => <br />,
        })}
      </h1>
      <ConvertIcon />
      <section className="flex flex-col gap-[2px] rounded-lg bg-black-3 p-4 pt-6">
        {contents.map((content, index) => (
          <Step
            key={content.title}
            step={(index + 1).toString()}
            title={content.title}
            description={content.description}
            isLast={index === contents.length - 1}
          />
        ))}
      </section>
    </section>
  );
}
