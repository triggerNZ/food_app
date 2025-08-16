import { PaymentRequest, PaymentResponse, PaymentProvider } from '@/types/payment';
import { BasePaymentProcessor } from './PaymentProcessor';

export class StripeProcessor extends BasePaymentProcessor {
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate Stripe API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!this.validateCardDetails(request.cardDetails)) {
      return {
        success: false,
        errorMessage: 'Invalid card details',
        errorCode: 'INVALID_CARD'
      };
    }

    // Simulate different scenarios based on card number
    const cardNumber = request.cardDetails.cardNumber.replace(/\s/g, '');
    
    // Simulate declined card
    if (cardNumber.endsWith('0002')) {
      return {
        success: false,
        errorMessage: 'Your card was declined',
        errorCode: 'CARD_DECLINED'
      };
    }

    // Simulate insufficient funds
    if (cardNumber.endsWith('0003')) {
      return {
        success: false,
        errorMessage: 'Insufficient funds',
        errorCode: 'INSUFFICIENT_FUNDS'
      };
    }

    // Simulate network error
    if (cardNumber.endsWith('0004')) {
      return {
        success: false,
        errorMessage: 'Network error occurred. Please try again.',
        errorCode: 'NETWORK_ERROR'
      };
    }

    // Success case
    return {
      success: true,
      transactionId: this.generateTransactionId()
    };
  }

  getProviderName(): PaymentProvider {
    return PaymentProvider.STRIPE;
  }
}