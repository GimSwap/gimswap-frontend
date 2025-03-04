import { SendTransactionParameters } from '@wagmi/core';
import { useAccount } from 'wagmi';
import { useGetCurrentWallet } from './useGetCurrentWallet';
import { checkIsMobileDevice } from '../utils/checkIsMobileDevice';
import { useSendTransaction as useSendTransactionWagmi } from 'wagmi';

export const useSendTransaction = () => {
  const { sendTransactionAsync: _sendTransactionAsync, ...rest } =
    useSendTransactionWagmi();
  const { connector } = useAccount();
  const { data: currentWallet } = useGetCurrentWallet();

  const sendTransactionAsync = async (params: SendTransactionParameters) => {
    if (
      connector?.id === 'walletConnect' &&
      currentWallet?.deepLink &&
      checkIsMobileDevice()
    ) {
      window.location.href = currentWallet.deepLink;
    }

    return await _sendTransactionAsync({ ...params });
  };

  return { sendTransactionAsync, ...rest };
};
