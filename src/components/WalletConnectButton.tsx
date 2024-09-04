import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWalletInfo,
} from "@web3modal/ethers/react";
import { shortenAddress } from "../lib/utils/shortenAddress";
import Image from "next/image";

export default function WalletConnectButton() {
  const { address } = useWeb3ModalAccount();
  const { walletInfo } = useWalletInfo();
  const { open, close } = useWeb3Modal();
  const handleOpen = async () => {
    try {
      open();
    } catch (err) {
      console.error("Failed to open wallet connect modal", err);
      close();
    }
  };
  return (
    <button
      className="py-2 px-3 bg-purple-500 c1 font-medium text-black-1 rounded-lg"
      onClick={handleOpen}
    >
      {address ? (
        <section className="flex gap-1">
          {walletInfo?.icon && (
            <Image
              src={walletInfo?.icon}
              alt="wallet-icon"
              width={16}
              height={16}
              className="bg-black-1 rounded-full p-[1.6px]"
            />
          )}
          {shortenAddress(address)}
        </section>
      ) : (
        "Connect"
      )}
    </button>
  );
}
