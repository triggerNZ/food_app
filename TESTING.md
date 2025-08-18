# Testing Guide

## How to Simulate a Successful Credit Card Transaction

To simulate a successful credit card transaction, you have **two options**:

### Option 1: Use Mock Payment Processor (Easiest)

1. **Select "Mock (Testing)" as payment provider** in the dropdown
2. **Use any valid card details** - the mock processor accepts any card that passes basic validation:
   - **Card Number**: Any 13-19 digit number (e.g., `4532 1234 5678 9012`)
   - **Expiry**: Any future date (e.g., `12/25`)
   - **CVV**: Any 3-4 digits (e.g., `123`)
   - **Cardholder Name**: Any name with 2+ characters (e.g., `John Doe`)

The MockProcessor in `src/services/payment/MockProcessor.ts:18` **always returns success** for valid card details.

### Option 2: Use Stripe with Success Card Numbers

For the Stripe processor, use these test card numbers for guaranteed success:
- `4242 4242 4242 4242` (Visa)
- `4000 0566 5566 5556` (Visa debit) 
- `5555 5555 5555 4444` (Mastercard)

**Avoid these Stripe test numbers** (they simulate failures):
- `4000 0000 0000 0002` - Card declined
- `4000 0000 0000 0003` - Insufficient funds

### Complete Success Flow:

1. Add items to cart
2. Go to checkout
3. Fill customer information (required)
4. Select "Mock (Testing)" payment provider  
5. Enter: `4532 1234 5678 9012`, `12/25`, `123`, `John Doe`
6. Click "Pay Now"

This will create a successful payment and order, redirecting you to the success page with order tracking link.