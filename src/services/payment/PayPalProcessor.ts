import { PaymentRequest, PaymentResponse, PaymentProvider } from '@/types/payment';
import { BasePaymentProcessor } from './PaymentProcessor';

export class PayPalProcessor extends BasePaymentProcessor {
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate PayPal API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (!this.validateCardDetails(request.cardDetails)) {
      return {
        success: false,
        errorMessage: 'Invalid card details',
        errorCode: 'INVALID_CARD'
      };
    }

    // Simulate different scenarios based on CVV
    const cvv = request.cardDetails.cvv;
    
    // Simulate expired card
    if (cvv === '001') {
      return {
        success: false,
        errorMessage: 'Your card has expired',
        errorCode: 'CARD_EXPIRED'
      };
    }

    // Simulate PayPal service unavailable
    if (cvv === '002') {
      return {
        success: false,
        errorMessage: 'PayPal service is currently unavailable',
        errorCode: 'SERVICE_UNAVAILABLE'
      };
    }

    // Simulate authentication failed
    if (cvv === '003') {
      return {
        success: false,
        errorMessage: 'Card authentication failed',
        errorCode: 'AUTH_FAILED'
      };
    }

    // Success case
    return {
      success: true,
      transactionId: this.generateTransactionId()
    };
  }

  getProviderName(): PaymentProvider {
    return PaymentProvider.PAYPAL;
  }
}