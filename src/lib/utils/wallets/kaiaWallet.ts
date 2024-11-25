import Caver from 'caver-js';
import { createConnector } from 'wagmi';
import {
  type EIP1193RequestFn,
  type Transport,
  UserRejectedRequestError,
  type WalletRpcSchema,
  getAddress,
  numberToHex,
  ProviderRpcError,
} from 'viem';
import { type Connector, ConnectorNotConnectedError } from '@wagmi/core';
import { checkIsMobileBrowser } from '@/src/lib/utils/checkIsMobileBrowser';

type Provider = ReturnType<
  Transport<'custom', unknown, EIP1193RequestFn<WalletRpcSchema>>
>;

let chainChanged: Connector['onChainChanged'] | undefined;
let isConnecting: Connector['onConnecting'] | undefined;

export function kaikasConnector() {
  let caver: Caver | undefined;

  return createConnector<Provider>((config) => {
    return {
      id: 'Kaia',
      name: 'Kaia',
      type: 'Kaia',
      icon: 'https://www.gimswap.com/svg/wallet/kaia.svg',

      async setup() {
        if (typeof window === 'undefined' || window.klaytn === undefined) {
          console.error('Kaia is not installed in this browser.');
        }
      },

      async connect({ chainId } = {}) {
        if (isConnecting) {
          throw new Error('Already connecting');
        }
        isConnecting = true;
        caver = new Caver(window.klaytn);
        try {
          await config.storage?.removeItem(`${this.id}.disconnected`);
          const rawAccounts = (await window.klaytn.enable()) as string[];
          const accounts = rawAccounts.map((account) =>
            getAddress(account),
          ) as `0x${string}`[];

          let currentChainId = await this.getChainId();
          if (chainId && currentChainId !== chainId) {
            const chain = await this.switchChain!({ chainId });
            currentChainId = chain.id;
          }

          if (!chainChanged) {
            chainChanged = this.onChainChanged.bind(this);
          }

          return {
            accounts,
            chainId: currentChainId,
          };
        } catch (error) {
          throw new UserRejectedRequestError(error as Error);
        } finally {
          isConnecting = false;
        }
      },

      async disconnect() {
        await config.storage?.setItem(`${this.id}.disconnected`, true);
        return config.emitter.emit('disconnect');
      },

      async getAccounts() {
        if (!caver) throw new ConnectorNotConnectedError();
        const rawAccounts = await caver.klay.getAccounts();
        return rawAccounts.map((account) =>
          getAddress(account),
        ) as `0x${string}`[];
      },

      async getChainId() {
        if (!caver) throw new ConnectorNotConnectedError();
        return await window.caver.klay.getChainId();
      },

      async getProvider() {
        return checkIsMobileBrowser('kaia')
          ? Promise.resolve(window.ethereum)
          : Promise.resolve(window.klaytn);
      },

      async isAuthorized() {
        const isDisconnected = await config.storage?.getItem(
          `${this.id}.disconnected`,
        );
        if (isDisconnected) return false;
        return window.klaytn._kaikas.isEnabled();
      },

      async onAccountsChanged(accounts) {
        if (accounts.length === 0) this.onDisconnect();
        else
          config.emitter.emit('change', {
            accounts: accounts.map((x) => getAddress(x)),
          });
      },

      async onChainChanged(chain) {
        const chainId = Number(chain);
        config.emitter.emit('change', { chainId });
      },

      async onDisconnect() {
        config.emitter.emit('disconnect');
      },

      async switchChain({ chainId }: { chainId: number }) {
        const id = numberToHex(chainId);
        const provider = await this.getProvider();
        if (!provider) throw new Error('Connector not found');
        try {
          await Promise.all([
            provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: id }],
            }),
            new Promise<void>((res) =>
              config.emitter.on('change', ({ chainId: _chainId }) => {
                if (_chainId === chainId) res();
              }),
            ),
            this.onChainChanged(chainId.toString()),
          ]);
          return (
            config.chains.find((x) => x.id === chainId) ?? {
              id: chainId,
              name: `Chain ${id}`,
              network: `${id}`,
              nativeCurrency: { name: 'Klay', decimals: 18, symbol: 'Klay' },
              rpcUrls: { default: { http: [''] }, public: { http: [''] } },
            }
          );
        } catch (error) {
          const chain = config.chains.find((x) => x.id === chainId);
          this.onChainChanged('0');
          if (!chain) throw new Error('Chain not supported by this Connector');
          if (
            (error as ProviderRpcError).code === 4902 ||
            (error as ProviderRpcError<{ originalError?: { code: number } }>)
              ?.data?.originalError?.code === 4902
          ) {
            try {
              await provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: id,
                    chainName: chain.name,
                    nativeCurrency: chain.nativeCurrency,
                    rpcUrls: chain.rpcUrls.default.http,
                    blockExplorerUrls: [
                      process.env.NEXT_PUBLIC_KLAYTN_BLOCK_EXPLORER_URLS!,
                    ],
                  },
                ],
              });

              const currentChainId = await this.getChainId();
              if (currentChainId !== chainId)
                throw new Error('User rejected switch after adding network.');

              return chain;
            } catch (err) {
              throw new Error(err as string);
            }
          } else {
            throw error;
          }
        }
      },
    };
  });
}
