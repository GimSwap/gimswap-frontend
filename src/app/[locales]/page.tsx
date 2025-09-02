import Description from "./_components/Description/Description";
import FAQ from "./_components/FAQ/FAQ";
import IntroduceKRWO from "./_components/IntroduceKRWO";
import KeyVisual from "./_components/KeyVisual";
import BlocksAmount from "@/src/app/[locales]/_components/BlocksAmount";
import { setRequestLocale } from "next-intl/server";

export default async function Home({
  params: { locales },
}: {
  params: { locales: string };
}) {
  setRequestLocale(locales);

  return (
    <main className="flex flex-col items-center pb-[360px]">
      <KeyVisual />
      <BlocksAmount />
      <section className="px-4 max-w-[1008px] inset-x-0">
        <Description />
        <IntroduceKRWO />
        <FAQ />
      </section>
    </main>
  );
}
