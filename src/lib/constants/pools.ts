import { kaia, bsc } from 'wagmi/chains';
import { DEX_PROVIDER, pancake, dgswap } from './dex';

export type LPINFO = {
    name: string;
    fee: number;
    provider: DEX_PROVIDER
}

export const LP_MAP: {
    [chainId: number]: LPINFO;
} = {
    [bsc.id] : {
        name: "USDT-KRWO",
        fee: 0.01,
        provider: pancake,
    },
    [kaia.id]: {
        name: "USDT-KRWO",
        fee: 0.2,
        provider: dgswap,
    }
};