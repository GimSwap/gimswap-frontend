import SwapInput from './_components/SwapInput';
import AddTokens from './_components/AddTokens';
import DocsButton from './_components/DocsButton';
import ContentBox from '../_components/ContentBox';

export default function Swap() {
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
