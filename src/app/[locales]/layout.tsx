import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Topbar from '../../components/navbar/Topbar';
import Footer from '../../components/navbar/Footer/Footer';
import { TopbarStoreProvider } from '@/src/lib/stores/topbarStore/TopbarStoreProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { AppKit } from '@/src/lib/utils/web3modal';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { PopupStoreProvider } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import PopupList from '@/src/components/popups/PopupList';
import WagmiProvider from '@/src/components/provider/WagmiProvider';
import QueryClientProvider from '@/src/components/provider/TanstackQueryProvider';
import { cookieToInitialState } from 'wagmi';
import { headers } from 'next/headers';
import { wagmiConfig } from '@/src/lib/utils/wagmi';

export const metadata: Metadata = {
  title: 'GIM SWAP',
  description:
    'Real Tokens from Real Assets: The Platform for Tokenized Fiat-backed Assets.',
  icons: {
    icon: 'https://gimswap.com/favicon.ico',
  },
  keywords: [
    'KRWO',
    'openvoucher',
    'stable coin',
    'Korean won stableCoin',
    'stablecoin',
  ],
  openGraph: {
    images: '/images/GimSwapOG.png',
    title: 'GIMSWAP',
    description: 'Real Tokens from Real Assets',
    siteName: 'GIMSWAP',
  },
};

const pretendard = localFont({
  src: [
    {
      path: '../../../public/fonts/Pretendard-Regular.subset.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Pretendard-Medium.subset.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Pretendard-Bold.subset.woff',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
});

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const wgamiInitialState = cookieToInitialState(
    wagmiConfig,
    headers().get('cookie'),
  );

  const messages = await getMessages();
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
  if (!GA_ID) throw new Error("There's no GA id");
  if (!GTM_ID) throw new Error("There's no GTM id");
  return (
    <html lang={locale} className={pretendard.variable}>
      <GoogleAnalytics gaId={GA_ID} />
      <GoogleTagManager gtmId="GTM-NV635GKQ" />
      <body>
        <NextIntlClientProvider messages={messages}>
          <WagmiProvider initialState={wgamiInitialState}>
            <QueryClientProvider>
              <AppKit>
                <PopupStoreProvider>
                  <TopbarStoreProvider>
                    <Topbar />
                    {children}
                    <Footer />
                    <PopupList />
                  </TopbarStoreProvider>
                </PopupStoreProvider>
              </AppKit>
            </QueryClientProvider>
          </WagmiProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
