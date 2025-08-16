import { PaymentRequest, PaymentResponse, PaymentProvider } from '@/types/payment';
import { BasePaymentProcessor } from './PaymentProcessor';

export class MockProcessor extends BasePaymentProcessor {
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!this.validateCardDetails(request.cardDetails)) {
      return {
        success: false,
        errorMessage: 'Invalid card details',
        errorCode: 'INVALID_CARD'
      };
    }

    // Mock processor always succeeds for valid cards
    return {
      success: true,
      transactionId: this.generateTransactionId()
    };
  }

  getProviderName(): PaymentProvider {
    return PaymentProvider.MOCK;
  }
}