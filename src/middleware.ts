import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/',
    '/(en|ko)/:path*',
    '/((?!api|_next/static|_next/image|images|script|svg|favicon.ico|sitemap.xml|.*\\.avif$).*)',
  ],
};
