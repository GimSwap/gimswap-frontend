import { useAccount } from 'wagmi';
import { useGetCurrentWallet } from './useGetCurrentWallet';
import { checkIsMobileDevice } from '../utils/checkIsMobileDevice';

export const useHandleWalletConnectDeepLink = () => {
  const { connector } = useAccount();
  const { data: currentWallet } = useGetCurrentWallet();

  const handleWalletConnectDeepLink = () => {
    if (
      connector?.id === 'walletConnect' &&
      currentWallet?.deepLink &&
      checkIsMobileDevice()
    ) {
      window.location.href = currentWallet.deepLink;
    }
  };

  return { handleWalletConnectDeepLink };
};
