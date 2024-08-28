import Link from "next/link";
import { SOCIALS } from "@/src/lib/constants/socials";

export default function Socials() {
  return (
    <section className="flex gap-3">
      {SOCIALS.map(({ Icon, link }) => (
        <Link href={link} target="_blank" className="p-[10px]">
          <Icon />
        </Link>
      ))}
    </section>
  );
}
