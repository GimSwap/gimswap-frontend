import { SendTransactionParameters } from '@wagmi/core';
import { useSendTransaction as useSendTransactionWagmi } from 'wagmi';
import { useHandleWalletConnectDeepLink } from './useHandleWalletConnectDeepLink';

export const useSendTransaction = () => {
  const { sendTransactionAsync: _sendTransactionAsync, ...rest } =
    useSendTransactionWagmi();
  const { handleWalletConnectDeepLink } = useHandleWalletConnectDeepLink();

  const sendTransactionAsync = async (params: SendTransactionParameters) => {
    handleWalletConnectDeepLink();
    return await _sendTransactionAsync({ ...params });
  };

  return { sendTransactionAsync, ...rest };
};
