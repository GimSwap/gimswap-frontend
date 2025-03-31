import { OPEN_VOUCHER } from '@/src/lib/constants/token';
import { WALLETS } from '@/src/lib/constants/wallets';
import { ChainIdType } from '@/src/lib/types/ChainIdType';
import { checkIsMobileDevice } from '@/src/lib/utils/checkIsMobileDevice';
import { wagmiConfig } from '@/src/lib/utils/wagmi';
import { signTypedData as wagmiSignTypedData } from '@wagmi/core';

interface SignTypedDataProps {
  address: `0x${string}`;
  decimalAppliedAmount: string;
  validAfter: number;
  validBefore: number;
  nonce: `0x${string}`;
  to: `0x${string}`;
  chainId: ChainIdType;
}

export const signTypedData = async ({
  address,
  decimalAppliedAmount,
  validAfter,
  validBefore,
  nonce,
  to,
  chainId,
}: SignTypedDataProps) => {
  const binanceWallet = WALLETS.find((wallet) =>
    wallet.connectorId.includes('wallet.binance.com'),
  );

  if (binanceWallet?.deepLink && checkIsMobileDevice())
    window.location.href = binanceWallet.deepLink;
  else console.error('Binance wallet deep link not found');

  return await wagmiSignTypedData(wagmiConfig, {
    domain: {
      name: 'OpenVoucher',
      version: '1',
      chainId,
      verifyingContract: OPEN_VOUCHER.contractAddress[chainId] as `0x${string}`,
    },
    primaryType: 'ReceiveWithAuthorization',
    types: {
      ReceiveWithAuthorization: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'validAfter', type: 'uint256' },
        { name: 'validBefore', type: 'uint256' },
        { name: 'nonce', type: 'bytes32' },
      ],
    },
    message: {
      from: address as `0x${string}`,
      to,
      value: BigInt(decimalAppliedAmount),
      validAfter: BigInt(validAfter),
      validBefore: BigInt(validBefore),
      nonce,
    },
  });
};
