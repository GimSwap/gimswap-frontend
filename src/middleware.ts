import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n";

export default createMiddleware({
  locales,
  defaultLocale: "en",
});
export const config = {
  matcher: [
    "/",
    "/(en)/:path*",
    "/((?!api|_next/static|_next/image|images|favicon.ico|.*\\.avif$).*)",
  ],
};
