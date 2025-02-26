import Accordion from '@/src/components/Accordion';
import { getTranslations } from 'next-intl/server';

export default async function FAQ() {
  const t = await getTranslations('quickDeposit.FAQ');

  const content = [
    {
      title: t('faq1.title'),
      content: t.rich('faq1.content', {
        br: () => <br />,
      }),
      description: [
        t('faq1.description.concept1'),
        t('faq1.description.concept2'),
      ],
    },
    {
      title: t('faq2.title'),
      content: t('faq2.content'),
    },
    {
      title: t('faq3.title'),
      content: t('faq3.content'),
    },
    {
      title: t('faq4.title'),
      content: t('faq4.content'),
    },
    {
      title: t('faq5.title'),
      content: t('faq5.content'),
    },
    {
      title: t('faq6.title'),
      content: t('faq6.content'),
    },
    {
      title: t('faq7.title'),
      content: t.rich('faq7.content', {
        br: () => <br />,
      }),
    },
    {
      title: t('faq8.title'),
      content: t('faq8.content'),
    },
  ];

  return (
    <Accordion
      title="FAQ"
      className="!py-4"
      titleClassName="text-h4 !font-bold px-6"
      chevronClassName="stroke-black-6 w-6 h-6"
    >
      <div className="p-6 bg-black-3 flex flex-col gap-3">
        {content.map((item) => (
          <div key={item.title}>
            <p className="p1 text-black-8 before:content-['•'] before:mr-2 font-bold">
              {item.title}
            </p>
            <div className="ml-[10px]">
              <p className="pt-2 p1 text-black-8">{item.content}</p>
              {item.description?.map((description) => (
                <p
                  key={description}
                  className="p1 text-black-8 ml-[10px] before:content-['•'] before:mr-2"
                >
                  {description}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Accordion>
  );
}
