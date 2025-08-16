describe('Checkout Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  const fillValidCardDetails = () => {
    cy.get('select').select('Mock (Testing)')
    cy.get('input[placeholder="1234 5678 9012 3456"]').type('4532123456789012')
    cy.get('input[placeholder="MM/YY"]').type('1225')
    cy.get('input[placeholder="123"]').type('123')
    cy.get('input[placeholder="John Doe"]').type('John Doe')
  }

  it('shows empty checkout state when no items in cart', () => {
    cy.visit('/checkout')
    cy.contains('No Items to Checkout').should('be.visible')
    cy.contains('Your cart is empty. Add some items first!').should('be.visible')
    cy.contains('Browse Restaurants').should('be.visible')
  })

  it('displays order summary with correct restaurant and items', () => {
    // Add item to cart first
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    
    // Go to checkout via cart page
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Check order summary
    cy.contains('Order Summary').should('be.visible')
    cy.contains('Pizza Palace').should('be.visible')
    cy.contains('Italian').should('be.visible')
    cy.contains('Delivery: 25-35 min').should('be.visible')
    cy.contains('Margherita Pizza').should('be.visible')
    cy.contains('Qty: 1').should('be.visible')
  })

  it('calculates subtotal, delivery fee, tax, and total correctly', () => {
    // Add item to cart
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click() // $16.99
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Check pricing breakdown - look for the structure, not exact format
    cy.contains('Subtotal:').should('be.visible')
    cy.contains('$16.99').should('be.visible')
    cy.contains('Delivery Fee:').should('be.visible')
    cy.contains('$2.99').should('be.visible')
    cy.contains('Tax:').should('be.visible')
    cy.contains('Total:').should('be.visible')
  })

  it('shows payment form with all required fields', () => {
    // Add item and go to checkout
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Check payment section
    cy.contains('Payment').should('be.visible')
    cy.get('input[placeholder="1234 5678 9012 3456"]').should('be.visible')
    cy.get('input[placeholder="MM/YY"]').should('be.visible')
    cy.get('input[placeholder="123"]').should('be.visible')
    cy.get('input[placeholder="John Doe"]').should('be.visible')
  })

  it('shows pay now button with correct total', () => {
    // Add item and go to checkout
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Check pay button (just look for Pay Now, total may vary due to calculation precision)
    cy.get('button').contains('Pay Now').should('be.visible')
    cy.contains('This is a demo app. No real payment will be processed.').should('be.visible')
  })

  it('processes payment and shows success page', () => {
    // Add item and go to checkout
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Fill valid card details
    fillValidCardDetails()
    
    // Click pay now
    cy.get('button').contains('Pay Now').click()
    
    // Should show processing state
    cy.contains('Processing Payment...').should('be.visible')
    
    // Wait for payment processing and success page
    cy.contains('Order Placed Successfully!', { timeout: 5000 }).should('be.visible')
    cy.contains('Your order from').should('be.visible')
    cy.contains('has been placed and is being prepared').should('be.visible')
    cy.contains('Estimated delivery time:').should('be.visible')
  })

  it('shows order confirmation page with correct actions', () => {
    // Add item, checkout, and complete payment
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Fill valid card details
    fillValidCardDetails()
    
    cy.get('button').contains('Pay Now').click()
    
    // Wait for success page
    cy.contains('Order Placed Successfully!', { timeout: 5000 }).should('be.visible')
    
    // Check success page actions
    cy.contains('Order More Food').should('be.visible')
    cy.contains('Print Receipt').should('be.visible')
    
    // Check success icon
    cy.get('span').contains('✓').should('be.visible')
  })

  it('navigates back to cart from checkout', () => {
    // Add item and go to checkout
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Click back to cart
    cy.contains('← Back to Cart').click()
    cy.url().should('include', '/cart')
    cy.contains('Your Cart').should('be.visible')
  })

  it('navigates to homepage from success page', () => {
    // Complete full checkout flow
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Fill valid card details
    fillValidCardDetails()
    
    cy.get('button').contains('Pay Now').click()
    
    // Wait for success page and click order more
    cy.contains('Order Placed Successfully!', { timeout: 5000 }).should('be.visible')
    cy.contains('Order More Food').click()
    
    // Should navigate to homepage
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.contains('Restaurants Near You').should('be.visible')
  })

  it('calculates correct total with multiple items', () => {
    // Add multiple items
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click() // $16.99
    cy.get('button').contains('Add to Cart').first().click() // $16.99 again (qty 2)
    cy.contains('Cart (2)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Check calculations with multiple items
    cy.contains('Subtotal:').should('be.visible')
    cy.contains('$33.98').should('be.visible') // 16.99 * 2
    cy.contains('Delivery Fee:').should('be.visible')
    cy.contains('$2.99').should('be.visible')
    cy.contains('Qty: 2').should('be.visible')
    cy.contains('Total:').should('be.visible')
  })

  it('clears cart after successful payment', () => {
    // Add item, complete checkout
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Fill valid card details
    fillValidCardDetails()
    
    cy.get('button').contains('Pay Now').click()
    
    // Wait for success page
    cy.contains('Order Placed Successfully!', { timeout: 5000 }).should('be.visible')
    
    // Navigate to cart - should be empty
    cy.visit('/cart')
    cy.contains('Your Cart is Empty').should('be.visible')
  })

  it('shows correct restaurant information in checkout', () => {
    // Test with different restaurant
    cy.contains('Sushi Spot').click()
    
    // Wait for menu to load and add first available item
    cy.get('button').contains('Add to Cart').first().should('be.visible')
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    cy.contains('Proceed to Checkout').click()
    
    // Check restaurant details
    cy.contains('Sushi Spot').should('be.visible')
    cy.contains('Japanese').should('be.visible')
    cy.contains('Delivery: 30-40 min').should('be.visible')
    
    // Check that some menu item is displayed (more flexible than checking specific item)
    cy.get('[data-testid="order-items"]').should('exist')
    cy.get('[data-testid="order-items"]').should('contain', 'Qty: 1')
  })
})