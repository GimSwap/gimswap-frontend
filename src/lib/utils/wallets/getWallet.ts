import { Connector } from 'wagmi';
import { getCookie } from '../cookie';

interface WalletValueInfoType {
  accounts: `0x${string}`[];
  chainId: number;
  connector: Pick<Connector, 'id' | 'name' | 'type'>;
}
type WalletValue = [string, WalletValueInfoType];

interface WalletInfoFromCookieType {
  state: {
    connections: {
      value: WalletValue[] | [];
    };
    chainId: number;
  };
}

export const getWalletInfo = async (): Promise<
  WalletValueInfoType | undefined
> => {
  const cookieValue = await getCookie('GimSwap.store');
  if (!cookieValue) return undefined;
  const parsedCookieValue = JSON.parse(cookieValue) as WalletInfoFromCookieType;

  return parsedCookieValue?.state?.connections?.value?.[0]?.[1];
};
