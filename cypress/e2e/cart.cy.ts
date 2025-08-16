describe('Cart Functionality', () => {
  beforeEach(() => {
    // Start fresh for each test
    cy.visit('/')
  })

  it('shows empty cart state initially', () => {
    cy.visit('/cart')
    cy.contains('Your Cart is Empty').should('be.visible')
    cy.contains('Add some delicious items from our restaurants!').should('be.visible')
    cy.contains('Browse Restaurants').should('be.visible')
  })

  it('allows adding items to cart and displays them', () => {
    // Go to restaurant page
    cy.contains('Pizza Palace').click()
    
    // Add first item
    cy.get('button').contains('Add to Cart').first().click()
    
    // Go to cart
    cy.contains('Cart (1)').click()
    
    // Verify cart content
    cy.contains('Your Cart').should('be.visible')
    cy.contains('Ordering from: Pizza Palace').should('be.visible')
    cy.contains('Margherita Pizza').should('be.visible')
    cy.contains('Total:').should('be.visible')
    cy.contains('$16.99').should('be.visible')
  })

  it('allows updating item quantities', () => {
    // Add item to cart
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    
    // Increase quantity
    cy.get('button').contains('+').click()
    cy.contains('2').should('be.visible') // quantity should be 2
    cy.contains('Total:').should('be.visible')
    cy.contains('$33.98').should('be.visible') // 2 * $16.99
    
    // Decrease quantity
    cy.get('button').contains('-').click()
    cy.contains('1').should('be.visible') // back to 1
    cy.contains('Total:').should('be.visible')
    cy.contains('$16.99').should('be.visible')
  })

  it('allows removing items from cart', () => {
    // Add item to cart
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    
    // Remove item
    cy.contains('Remove').click()
    
    // Should show empty cart
    cy.contains('Your Cart is Empty').should('be.visible')
  })

  it('allows clearing entire cart', () => {
    // Add multiple items
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.get('button').contains('Add to Cart').last().click()
    cy.contains('Cart (2)').click()
    
    // Clear cart
    cy.contains('Clear Cart').click()
    
    // Should show empty cart
    cy.contains('Your Cart is Empty').should('be.visible')
  })

  it('calculates totals correctly with multiple items', () => {
    // Add the same item twice to test quantity calculation
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click() // $16.99 Margherita
    cy.get('button').contains('Add to Cart').first().click() // $16.99 Margherita again
    cy.contains('Cart (2)').click()
    
    // Check that item appears with quantity 2
    cy.contains('Margherita Pizza').should('be.visible')
    cy.contains('2').should('be.visible') // quantity
    cy.contains('Total:').should('be.visible')
    cy.contains('$33.98').should('be.visible') // 16.99 * 2
  })

  it('shows continue shopping link to current restaurant', () => {
    // Add item and go to cart
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    
    // Should show continue shopping link
    cy.contains('Continue Shopping at Pizza Palace').should('be.visible')
    
    // Clicking should go back to restaurant
    cy.contains('Continue Shopping at Pizza Palace').click()
    cy.url().should('include', '/restaurant/1')
  })

  it('shows proceed to checkout button', () => {
    // Add item and go to cart
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    
    // Should show checkout button
    cy.contains('Proceed to Checkout').should('be.visible')
    
    // Clicking should navigate to checkout
    cy.contains('Proceed to Checkout').click()
    cy.url().should('include', '/checkout')
  })

  it('decreasing quantity to 0 removes item', () => {
    // Add item to cart
    cy.contains('Pizza Palace').click()
    cy.get('button').contains('Add to Cart').first().click()
    cy.contains('Cart (1)').click()
    
    // Decrease quantity to 0
    cy.get('button').contains('-').click()
    
    // Item should be removed, cart should be empty
    cy.contains('Your Cart is Empty').should('be.visible')
  })
})