import DescriptionCard from "./DescriptionCard";
import guardImage from "@/src/assets/icons/guard.webp";
import arrowImage from "@/src/assets/icons/arrow.webp";
import directionImage from "@/src/assets/icons/direction.webp";
import Image from "next/image";

export default function Description() {
  return (
    <section className="pt-[100px] flex flex-col items-center justify-center">
      <h1 className="font-bold mb-6 whitespace-nowrap">GIMSWAP Benefit</h1>
      <section className="flex flex-col gap-3 lg:flex-row">
        <DescriptionCard
          Icon={<Image src={guardImage} alt="RWA" width={60} height={60} />}
          title={
            <>
              100%<br></br>RWA backed
            </>
          }
          description="Tokens issued by GimSwap are backed by RWAs, making them interchangeable with those assets"
        />
        <DescriptionCard
          Icon={
            <Image src={arrowImage} alt="convenient" width={60} height={60} />
          }
          title={
            <>
              Convenient Trade<br></br>and Usage
            </>
          }
          description="RWA tokens can be easily traded on chain as well as used for daily life or service development."
        />
        <DescriptionCard
          Icon={
            <Image
              src={directionImage}
              alt="transparency"
              width={60}
              height={60}
            />
          }
          title={
            <>
              Transparency <br></br>and Decentralization
            </>
          }
          description="GimSwap’s contract is immutable and open-source, ensuring complete transparency and trust."
        />
      </section>
    </section>
  );
}
