import BuyInput from './_components/BuyInput';
import DocsButton from '../swap/_components/DocsButton';
import ContentBox from '../_components/ContentBox';
import { setRequestLocale } from 'next-intl/server';

export default function Buy({
  params: { locales },
}: {
  params: { locales: string };
}) {
  setRequestLocale(locales);

  return (
    <ContentBox>
      <DocsButton />
      <BuyInput />
    </ContentBox>
  );
}
