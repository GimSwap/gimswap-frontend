export interface OpenVoucherPaymentSearchParamsType {
  amount: string;
  method: 'purchase' | 'history';
  redirectOnSuccess?: string;
  redirectOnError?: string;
  redirectOnCancel?: string;
}
