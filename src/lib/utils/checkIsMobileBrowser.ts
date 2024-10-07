export const checkIsMobileBrowser = (browser: 'kaia' | 'metamask' | string) => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes(browser.toLowerCase());
};
