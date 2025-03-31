import { makeSignMessage } from '@/src/app/[locales]/trade/buy/_utils/makeSignMessage';
import { OpenVoucherPaymentSearchParamsType } from '@/src/lib/types/OpenVoucherPaymentType';
import useSign from './useSign';
import { useGetCurrentWallet } from './useGetCurrentWallet';
import { useAccount } from 'wagmi';
import { checkIsMobileBrowser } from '../utils/checkIsMobileBrowser';

const METHOD_URL = {
  purchase: 'buy',
  history: 'transactions',
};

export const useOpenPaymentPopup = () => {
  const { sign } = useSign();
  const { data: currentWallet } = useGetCurrentWallet();
  const { address, chainId } = useAccount();

  const openOVPaymentPopup = async (
    params: OpenVoucherPaymentSearchParamsType,
  ) => {
    if (!currentWallet || !address || !chainId) return;
    const signMessage = makeSignMessage(address);
    const signature = await sign(address, signMessage);
    if (!signature) return;
    const searchParamsString = new URLSearchParams(
      Object.fromEntries(
        Object.entries({
          ...params,
          signMessage: btoa(signMessage),
          signature,
          walletId: currentWallet.id,
          walletAddress: address,
          chainId: chainId.toString(),
        }).filter(([_, value]) => value !== undefined),
      ),
    ).toString();

    const url = `${process.env.NEXT_PUBLIC_OPEN_VOUCHER_URL}/payment/${METHOD_URL[params.method]}?${searchParamsString}`;
    if (checkIsMobileBrowser('metamask')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'popup=true,width=380,height=780');
    }
  };

  return { openOVPaymentPopup };
};
