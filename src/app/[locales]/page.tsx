import { fetchGetBlockAmount } from '@/src/lib/utils/api/fetchGetBlockAmount';
import Description from './_components/Description/Description';
import FAQ from './_components/FAQ/FAQ';
import IntroduceKRWO from './_components/IntroduceKRWO';
import KeyVisual from './_components/KeyVisual';
import BlocksAmount from '@/src/app/[locales]/_components/BlocksAmount';

export default async function Home() {
  const { locked } = await fetchGetBlockAmount();
  return (
    <main className="flex flex-col items-center pb-[280px]">
      <KeyVisual />
      <BlocksAmount locked={locked} />
      <section className="px-4 max-w-[1008px] inset-x-0">
        <Description />
        <IntroduceKRWO />
        <FAQ />
      </section>
    </main>
  );
}
