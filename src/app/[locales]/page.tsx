import Description from "./_components/Description/Description";
import FAQ from "./_components/FAQ/FAQ";
import IntroduceToT from "./_components/IntroduceToT";
import KeyVisual from "./_components/KeyVisual";

export default function Home() {
  return (
    <main className="flex flex-col items-center pb-[280px]">
      <KeyVisual />
      <section className="px-4 max-w-[1008px] inset-x-0">
        <Description />
        <IntroduceToT />
        <FAQ />
      </section>
    </main>
  );
}
