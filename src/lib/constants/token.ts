import { CONTRACT_ADDRESS } from "./contractAddress";
import openVoucherIcon from "@/public/svg/token/open-voucher.svg";
import totIcon from "@/public/svg/token/tot.svg";
import { TokenType } from "../types/TokenType";

export const EXCHANGE_RATE_DECIMAL_OV_TO_TOT = 4;
export const SWAP_DECIMAL_OV_TO_TOT = 6;

export const OPEN_VOUCHER: TokenType = {
  name: "Open Voucher",
  unit: 10000,
  contractAddress: CONTRACT_ADDRESS.OpenVoucher,
  icon: openVoucherIcon,
  imageUrl: "https://www.gimswap.com/svg/token/open-voucher.svg",
  symbol: "OV",
  method: "transferVoucherAndCall",
  decimal: 10,
};

export const TOT: TokenType = {
  name: "TOT",
  unit: 1,
  contractAddress: CONTRACT_ADDRESS.ToT,
  icon: totIcon,
  imageUrl: "https://www.gimswap.com/svg/token/tot.svg",
  symbol: "TOT",
  method: "transferAndCall",
  decimal: 6,
};

export const KLAYTN = {
  chainId: 0x2019,
  chainName: "Klaytn Cypress",
  blockExplorerUrl: "https://klaytnfinder.io",
  klaytnRpcUrl: "https://public-en-cypress.klaytn.net",
  currency: "KLAY",
} as const;
