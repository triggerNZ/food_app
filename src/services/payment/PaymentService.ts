import { PaymentRequest, PaymentResponse, PaymentProvider } from '@/types/payment';
import { BasePaymentProcessor } from './PaymentProcessor';
import { StripeProcessor } from './StripeProcessor';
import { PayPalProcessor } from './PayPalProcessor';
import { MockProcessor } from './MockProcessor';

export class PaymentService {
  private processors: Map<PaymentProvider, BasePaymentProcessor>;
  private defaultProvider: PaymentProvider;

  constructor(defaultProvider: PaymentProvider = PaymentProvider.STRIPE) {
    this.processors = new Map();
    this.processors.set(PaymentProvider.STRIPE, new StripeProcessor());
    this.processors.set(PaymentProvider.PAYPAL, new PayPalProcessor());
    this.processors.set(PaymentProvider.MOCK, new MockProcessor());
    this.defaultProvider = defaultProvider;
  }

  async processPayment(
    request: PaymentRequest, 
    provider?: PaymentProvider
  ): Promise<PaymentResponse> {
    const selectedProvider = provider || this.defaultProvider;
    const processor = this.processors.get(selectedProvider);

    if (!processor) {
      return {
        success: false,
        errorMessage: `Payment provider ${selectedProvider} is not supported`,
        errorCode: 'UNSUPPORTED_PROVIDER'
      };
    }

    try {
      const response = await processor.processPayment(request);
      
      // Log transaction for audit purposes
      console.log(`Payment processed via ${selectedProvider}:`, {
        orderId: request.orderId,
        amount: request.amount,
        success: response.success,
        transactionId: response.transactionId,
        errorCode: response.errorCode
      });

      return response;
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        errorMessage: 'An unexpected error occurred while processing payment',
        errorCode: 'PROCESSING_ERROR'
      };
    }
  }

  getAvailableProviders(): PaymentProvider[] {
    return Array.from(this.processors.keys());
  }

  setDefaultProvider(provider: PaymentProvider): void {
    if (this.processors.has(provider)) {
      this.defaultProvider = provider;
    } else {
      throw new Error(`Provider ${provider} is not available`);
    }
  }

  validateCardDetails(cardDetails: any): boolean {
    // Use the default processor's validation
    const processor = this.processors.get(this.defaultProvider);
    return processor ? processor.validateCardDetails(cardDetails) : false;
  }
}