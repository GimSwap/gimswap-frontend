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
    <section className="pt-8 px-6">
      <h5 className="font-medium text-purple-500">{t('title')}</h5>
      <h1 className="font-bold pt-2">
        {t.rich('subTitle', {
          br: () => <br />,
        })}
      </h1>
      <ConvertIcon />
      <section className="rounded-lg bg-black-3 p-4 flex flex-col gap-[2px] pt-6">
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
