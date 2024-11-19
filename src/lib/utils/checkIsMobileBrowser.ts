export const checkIsMobileBrowser = (browser: 'kaia' | 'metamask' | string) => {
  if (browser === 'kaia') {
    return typeof window.klaytn !== 'undefined' && window.klaytn.isMobile;
  }
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes(browser.toLowerCase());
};
