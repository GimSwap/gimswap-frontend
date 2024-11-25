export interface PaymentMessageType extends MessageEvent {
  data:
    | 'PAYMENT_SUCCESS'
    | 'PAYMENT_PENDING'
    | 'PAYMENT_CANCEL'
    | 'PAYMENT_ERROR';
}
