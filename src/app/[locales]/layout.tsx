import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/src/components/navbar/Topbar';
import Footer from '../../components/navbar/Footer/Footer';
import { TopbarStoreProvider } from '@/src/lib/stores/topbarStore/TopbarStoreProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { PopupStoreProvider } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import PopupList from '@/src/components/popups/PopupList';
import WagmiProvider from '@/src/components/provider/WagmiProvider';
import QueryClientProvider from '@/src/components/provider/TanstackQueryProvider';
import { cookieToInitialState } from 'wagmi';
import { headers } from 'next/headers';
import { wagmiConfig } from '@/src/lib/utils/wagmi';
import { notFound } from 'next/navigation';
import { routing } from '@/src/i18n/routing';
import { LiquidityStoreProvider } from '@/src/lib/stores/liquidityStore/LiquidityStoreProvider';
import Head from 'next/head';
import Script from 'next/script';
import MixpanelProvider from '@/src/components/provider/MixpanelProvider';
import { StrictMode } from 'react';
export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locales: locale }));
};

export const metadata: Metadata = {
  title: 'GIM SWAP | KRWO',
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
  params: { locales },
}: {
  children: React.ReactNode;
  params: { locales: string };
}) {
  const header = await headers();
  const isDev = process.env.NEXT_PUBLIC_ENV_MODE !== 'production';
  if (!routing.locales.includes(locales as any)) {
    notFound();
  }

  setRequestLocale(locales);
  const wgamiInitialState = cookieToInitialState(
    wagmiConfig,
    header.get('cookie'),
  );

  const messages = await getMessages();
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
  if (!GA_ID) throw new Error("There's no GA id");
  if (!GTM_ID) throw new Error("There's no GTM id");

  return (
    <html lang={locales} className={pretendard.variable}>
      <GoogleAnalytics gaId={GA_ID} />
      <GoogleTagManager gtmId="GTM-NV635GKQ" />
      <Head>
        <meta
          name="robots"
          content={isDev ? 'noindex,nofollow' : 'index,follow'}
        />
      </Head>
      <body>
        <StrictMode>
          <MixpanelProvider>
            <NextIntlClientProvider messages={messages}>
              <WagmiProvider initialState={wgamiInitialState}>
                <QueryClientProvider>
                  <PopupStoreProvider>
                    <TopbarStoreProvider>
                      <LiquidityStoreProvider>
                        <Navbar />
                        {children}
                        <Footer />
                        <PopupList />
                      </LiquidityStoreProvider>
                    </TopbarStoreProvider>
                  </PopupStoreProvider>
                </QueryClientProvider>
              </WagmiProvider>
            </NextIntlClientProvider>
          </MixpanelProvider>
        </StrictMode>
      </body>
      <Script src="/script/XTrackingCode.js" strategy="lazyOnload" />
      <Script src="/script/mixpanel.js" strategy="lazyOnload"></Script>
    </html>
  );
}
