export interface PaymentMessageType extends MessageEvent {
  data:
    | 'PAYMENT_SUCCESS'
    | 'PAYMENT_PENDING'
    | 'PAYMENT_CANCEL'
    | 'PAYMENT_ERROR';
}

export interface PaymentMessageDataType {
  state:
    | 'PAYMENT_SUCCESS'
    | 'PAYMENT_PENDING'
    | 'PAYMENT_CANCEL'
    | 'PAYMENT_ERROR'
    | 'INVALID_TERMS'
    | 'CLOSE';
}
