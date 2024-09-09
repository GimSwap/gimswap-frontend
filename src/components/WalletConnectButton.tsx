import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWalletInfo,
} from "@web3modal/ethers/react";
import { shortenAddress } from "../lib/utils/shortenAddress";
import { WALLET_ICONS } from "../lib/constants/walletIcons";

interface WalletConnectButtonProps {
  size: "small" | "large";
}

export default function WalletConnectButton({
  size,
}: WalletConnectButtonProps) {
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
  const WalletIcon = walletInfo?.name && WALLET_ICONS[walletInfo.name];

  return (
    <button
      className={`bg-purple-500 font-medium text-black-1 rounded-lg ${
        size === "small" ? "c1 py-2 px-3" : "py-3 px-4 text-h5 font-bold"
      }`}
      onClick={handleOpen}
    >
      {address ? (
        <section className="flex gap-1 justify-center">
          {walletInfo?.icon && (
            <section className="flex gap-1">
              {WalletIcon && (
                <WalletIcon
                  className={`${
                    size === "small" ? "w-4 h-4 p-[1.6px]" : "w-6 h-6 p-[2.4px]"
                  }" bg-black-1 rounded-full`}
                />
              )}
              {shortenAddress(address)}
            </section>
          )}
        </section>
      ) : (
        "Connect"
      )}
    </button>
  );
}
