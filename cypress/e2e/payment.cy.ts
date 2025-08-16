describe('Payment Processing', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('allows selecting different payment providers', () => {
    // Add item to cart and go to checkout
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Check payment provider selector
    cy.get('select').should('contain', 'Stripe')
    cy.get('select').should('contain', 'PayPal')
    cy.get('select').should('contain', 'Mock (Testing)')
    
    // Select PayPal
    cy.get('select').select('PayPal')
  })

  it('validates credit card details', () => {
    // Add item and go to checkout
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Try to pay without filling card details
    cy.get('button').contains('Pay Now').click()
    
    // Should show validation error
    cy.contains('Please check your card details').should('be.visible')
  })

  it('formats card number with spaces', () => {
    // Add item and go to checkout
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Type card number
    cy.get('input[placeholder="1234 5678 9012 3456"]').type('4532123456789012')
    
    // Should be formatted with spaces
    cy.get('input[placeholder="1234 5678 9012 3456"]').should('have.value', '4532 1234 5678 9012')
  })

  it('formats expiry date correctly', () => {
    // Add item and go to checkout
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Type expiry date
    cy.get('input[placeholder="MM/YY"]').type('1225')
    
    // Should be formatted with slash
    cy.get('input[placeholder="MM/YY"]').should('have.value', '12/25')
  })

  it('processes successful payment with mock processor', () => {
    // Add item and go to checkout
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Select mock processor for testing
    cy.get('select').select('Mock (Testing)')
    
    // Fill in valid card details
    cy.get('input[placeholder="1234 5678 9012 3456"]').type('4532123456789012')
    cy.get('input[placeholder="MM/YY"]').type('1225')
    cy.get('input[placeholder="123"]').type('123')
    cy.get('input[placeholder="John Doe"]').type('John Doe')
    
    // Submit payment
    cy.get('button').contains('Pay Now').click()
    
    // Should show processing state
    cy.contains('Processing Payment...').should('be.visible')
    
    // Should show success page
    cy.contains('Order Placed Successfully!', { timeout: 10000 }).should('be.visible')
    cy.contains('Transaction ID:').should('be.visible')
  })

  it('handles payment failure with Stripe processor', () => {
    // Add item and go to checkout
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Use Stripe processor (default)
    cy.get('select').should('have.value', 'stripe')
    
    // Fill in card details that will be declined (ends with 0002)
    cy.get('input[placeholder="1234 5678 9012 3456"]').type('4532123456780002')
    cy.get('input[placeholder="MM/YY"]').type('1225')
    cy.get('input[placeholder="123"]').type('123')
    cy.get('input[placeholder="John Doe"]').type('John Doe')
    
    // Submit payment
    cy.get('button').contains('Pay Now').click()
    
    // Should show processing state
    cy.contains('Processing Payment...').should('be.visible')
    
    // Should show error message
    cy.contains('Your card was declined', { timeout: 10000 }).should('be.visible')
    
    // Should not redirect to success page
    cy.contains('Order Placed Successfully!').should('not.exist')
  })

  it('handles insufficient funds error', () => {
    // Add item and go to checkout
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Fill in card details that will trigger insufficient funds (ends with 0003)
    cy.get('input[placeholder="1234 5678 9012 3456"]').type('4532123456780003')
    cy.get('input[placeholder="MM/YY"]').type('1225')
    cy.get('input[placeholder="123"]').type('123')
    cy.get('input[placeholder="John Doe"]').type('John Doe')
    
    // Submit payment
    cy.get('button').contains('Pay Now').click()
    
    // Should show insufficient funds error
    cy.contains('Insufficient funds', { timeout: 10000 }).should('be.visible')
  })

  it('clears error when user starts typing', () => {
    // Add item and go to checkout
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Try to pay without filling details to trigger error
    cy.get('button').contains('Pay Now').click()
    cy.contains('Please check your card details').should('be.visible')
    
    // Start typing in card number
    cy.get('input[placeholder="1234 5678 9012 3456"]').type('4532')
    
    // Error should disappear
    cy.contains('Please check your card details').should('not.exist')
  })
})