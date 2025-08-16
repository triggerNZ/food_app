export interface CreditCardDetails {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  cardDetails: CreditCardDetails;
  orderId: string;
  customerEmail?: string;
  description?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
  errorCode?: string;
}

export enum PaymentProvider {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  MOCK = 'mock'
}

export interface PaymentProcessor {
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  validateCardDetails(cardDetails: CreditCardDetails): boolean;
  getProviderName(): PaymentProvider;
}