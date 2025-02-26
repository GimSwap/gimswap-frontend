import { CONTRACT_ADDRESS_MAP, OPEN_VOUCHER } from '@/src/lib/constants/token';
import { WALLETS } from '@/src/lib/constants/wallets';
import { checkIsMobileDevice } from '@/src/lib/utils/checkIsMobileDevice';
import { wagmiConfig } from '@/src/lib/utils/wagmi';
import { signTypedData as wagmiSignTypedData } from '@wagmi/core';
import { bsc } from 'wagmi/chains';

interface SignTypedDataProps {
  address: `0x${string}`;
  decimalAppliedOvAmount: string;
  validAfter: number;
  validBefore: number;
  nonce: `0x${string}`;
}

export const signTypedData = async ({
  address,
  decimalAppliedOvAmount,
  validAfter,
  validBefore,
  nonce,
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
      chainId: bsc.id,
      verifyingContract: OPEN_VOUCHER.contractAddress[bsc.id] as `0x${string}`,
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
      to: CONTRACT_ADDRESS_MAP.GIMSWAP_SWIFT_TRANSFER[bsc.id] as `0x${string}`,
      value: BigInt(decimalAppliedOvAmount),
      validAfter: BigInt(validAfter),
      validBefore: BigInt(validBefore),
      nonce,
    },
  });
};
