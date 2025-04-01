import ChevronLeftIcon from '@/public/svg/chevron-left.svg';
import WalletConnectButton from '@/src/components/connectWallet/WalletConnectButton';
import { useRouter } from 'next/navigation';

export default function DepositTopBar() {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  return (
    <nav className="fixed top-0 z-50 flex h-topbar w-full items-center justify-between bg-black-1 px-4 transition-all duration-500">
      <ChevronLeftIcon
        className="h-4 w-4 cursor-pointer text-[#212121]"
        onClick={handleGoBack}
      />
      <div className="h-8 w-fit">
        <WalletConnectButton size="small" />
      </div>
    </nav>
  );
}
