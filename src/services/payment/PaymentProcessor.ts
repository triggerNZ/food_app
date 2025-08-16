import { PaymentRequest, PaymentResponse, CreditCardDetails, PaymentProvider } from '@/types/payment';

export abstract class BasePaymentProcessor {
  abstract processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  abstract getProviderName(): PaymentProvider;

  validateCardDetails(cardDetails: CreditCardDetails): boolean {
    // Basic validation
    const { cardNumber, expiryMonth, expiryYear, cvv, cardholderName } = cardDetails;

    // Check if all fields are present
    if (!cardNumber || !expiryMonth || !expiryYear || !cvv || !cardholderName) {
      return false;
    }

    // Validate card number (remove spaces and check if it's 13-19 digits)
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleanCardNumber)) {
      return false;
    }

    // Validate expiry month (01-12)
    const month = parseInt(expiryMonth, 10);
    if (month < 1 || month > 12) {
      return false;
    }

    // Validate expiry year (current year or future)
    const currentYear = new Date().getFullYear();
    const year = parseInt(`20${expiryYear}`, 10);
    if (year < currentYear) {
      return false;
    }

    // Validate CVV (3-4 digits)
    if (!/^\d{3,4}$/.test(cvv)) {
      return false;
    }

    // Validate cardholder name (at least 2 characters)
    if (cardholderName.trim().length < 2) {
      return false;
    }

    return true;
  }

  protected generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}