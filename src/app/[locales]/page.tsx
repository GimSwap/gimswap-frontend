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
    </main>
  );
}
