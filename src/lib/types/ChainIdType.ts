import { chains } from '../utils/wagmi';

export type ChainIdType = (typeof chains)[number]['id'];
