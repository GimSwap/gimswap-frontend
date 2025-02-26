import { useTranslations } from 'next-intl';

export default function BuyOVFAQ() {
  const t = useTranslations('quickDeposit.buyOv.FAQ');
  const faqTexts = {
    title: t('title'),
    description: t('description'),
    conceptTitle: t('conceptTitle'),
    concepts: [t('concept1'), t('concept2')],
    note: t('note'),
  };

  return (
    <section className="bg-black-3 p-6 text-black-8">
      <p className="p1">{faqTexts.title}</p>
      <br />
      <p className="p1">{faqTexts.description}</p>
      <br />
      <p className="p1">{faqTexts.conceptTitle}</p>
      <ul className="list-disc pl-5">
        {faqTexts.concepts.map((text) => (
          <li key={text} className="p1 ">
            {text}
          </li>
        ))}
      </ul>
      <br />
      <p className="p1">{faqTexts.note}</p>
    </section>
  );
}
