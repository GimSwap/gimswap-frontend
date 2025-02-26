import { createWalletClient } from 'viem';
import { custom, useAccount, useSignMessage } from 'wagmi';
import { checkIsMobileBrowser } from '../utils/checkIsMobileBrowser';
import { fetchSendLog } from '../utils/api/fetchSendLog';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { WalletType } from '../constants/wallets';
import { checkIsMobileDevice } from '../utils/checkIsMobileDevice';

export default function useSign() {
  const { connector } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const sign = async (
    account: `0x${string}`,
    message: string,
    currentWallet?: WalletType,
  ): Promise<string | undefined> => {
    if (!connector) return;
    const provider = (await connector.getProvider()) as InstanceType<
      typeof EthereumProvider
    >;
    const walletClient = createWalletClient({
      transport: custom(provider as any),
    });
    try {
      if (connector.id === 'Kaia' || connector.id === 'Kaikas') {
        if (checkIsMobileBrowser('kaia')) {
          return walletClient?.signMessage({
            account,
            message,
          });
        } else {
          return window.klaytn.request({
            method: 'klay_sign',
            params: [account, message],
          });
        }
      } else {
        if (
          connector.id === 'walletConnect' &&
          currentWallet?.deepLink &&
          checkIsMobileDevice()
        ) {
          window.location.href = currentWallet.deepLink;
        }

        return signMessageAsync({ message });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      fetchSendLog({ name: 'sign', error: errorMessage });
    }
  };

  return { sign };
}
