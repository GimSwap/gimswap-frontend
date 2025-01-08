import SwapInput from './_components/SwapInput';
import AddTokens from './_components/AddTokens';
import DocsButton from './_components/DocsButton';
import ContentBox from '../_components/ContentBox';
import { setRequestLocale } from 'next-intl/server';

export default function Swap({
  params: { locales },
}: {
  params: { locales: string };
}) {
  setRequestLocale(locales);

  return (
    <>
      <ContentBox>
        <DocsButton />
        <SwapInput />
      </ContentBox>
      <AddTokens />
    </>
  );
}
