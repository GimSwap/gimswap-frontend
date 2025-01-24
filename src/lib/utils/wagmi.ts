import { http, createConfig, createStorage, cookieStorage } from 'wagmi';
import { bsc, kaia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { kaikasConnector } from '@/src/lib/utils/wallets/kaiaWallet';
import { fallback } from 'viem';

export const STORE_KEY = 'GimSwap';

export const chains = [bsc, kaia] as const;

export const wagmiConfig = createConfig({
  chains,
  connectors: [
    kaikasConnector(),
    injected({ target: 'metaMask', shimDisconnect: true }),
  ],
  transports: {
    [kaia.id]: fallback([
      http('https://public-en.node.kaia.io'),
      http('https://kaia-mainnet.rpc.grove.city/v1/803ceedf'),
      http('https://klaytn.drpc.org'),
      http('https://go.getblock.io/d7094dbd80ab474ba7042603fe912332'),
      http('https://1rpc.io/klay'),
    ]),
    [bsc.id]: fallback([
      http('https://bsc-pokt.nodies.app'),
      http('https://bscrpc.com'),
      http('https://endpoints.omniatech.io/v1/bsc/mainnet/public'),
      http('https://go.getblock.io/cc778cdbdf5c4b028ec9456e0e6c0cf3'),
      http('https://bsc-rpc.publicnode.com'),
      http('https://bsc.meowrpc.com'),
      http('https://bsc.blockrazor.xyz'),
      http('https://rpc.ankr.com/bsc'),
    ]),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
    key: STORE_KEY,
  }),
  syncConnectedChain: true,
});
