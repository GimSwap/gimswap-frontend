'use client';

import { type State, WagmiProvider as _wagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/src/lib/utils/wagmi';

interface WagmiProviderProps {
  children: React.ReactNode;
  initialState: State | undefined;
}

export default function WagmiProvider({
  children,
  initialState,
}: WagmiProviderProps) {
  return (
    <_wagmiProvider config={wagmiConfig} initialState={initialState}>
      {children}
    </_wagmiProvider>
  );
}
