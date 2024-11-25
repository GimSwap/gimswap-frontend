import LogoIcon from "@/public/svg/logo.svg";
import Socials from "./Socials";

export default function Footer() {
  return (
    <section className="absolute bottom-0 py-14 px-4 w-full max-w-[1008px] left-1/2 -translate-x-1/2 flex flex-col lg:flex-row lg:justify-between ">
      <div>
        <LogoIcon className="invert" />
        <section className="pt-6 pb-[80px]">
          <p className="p1">Contact: contact@gimswap.com</p>
          <p className="p1">Copyright 2024 Gimswap. All rights reserved.</p>
          <p className="p1">Commit Hash: {process.env.COMMIT_HASH}</p>
        </section>
      </div>
      <Socials />
    </section>
  );
}
