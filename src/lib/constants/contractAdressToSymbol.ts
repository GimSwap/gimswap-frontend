const _rawContractAddressMap: Record<string, string> = {
  '0x55d398326f99059fF775485246999027B3197955': 'USDT',
  '0x5C13E303a62Fc5DEdf5B52D66873f2E59fEdADC2': 'USDT',
  '0xBB4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c': 'BNB',
  '0x19aac5f612f524b754ca7e7c41cbfa2e981a4432': 'KAIA',
};

export const CONTRACT_ADDRESS_TO_SYMBOL: Record<string, string> =
  Object.fromEntries(
    Object.entries(_rawContractAddressMap).map(([address, symbol]) => [
      address.toLowerCase(),
      symbol,
    ]),
  );
