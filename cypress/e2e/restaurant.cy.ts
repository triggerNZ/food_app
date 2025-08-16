describe('Restaurant Page', () => {
  beforeEach(() => {
    cy.visit('/restaurant/1') // Pizza Palace
  })

  it('displays restaurant information correctly', () => {
    cy.contains('Pizza Palace').should('be.visible')
    cy.contains('Italian').should('be.visible')
    cy.contains('Authentic Italian pizza made with fresh ingredients').should('be.visible')
    cy.contains('4.5').should('be.visible')
    cy.contains('25-35 min').should('be.visible')
  })

  it('shows navigation links', () => {
    cy.contains('← Back to Restaurants').should('be.visible')
    cy.contains('Cart (0)').should('be.visible')
  })

  it('displays menu items with details', () => {
    cy.contains('Menu').should('be.visible')
    
    // Check Margherita Pizza
    cy.contains('Margherita Pizza').should('be.visible')
    cy.contains('Classic pizza with tomato sauce, mozzarella, and basil').should('be.visible')
    cy.contains('$16.99').should('be.visible')
    
    // Check Pepperoni Pizza
    cy.contains('Pepperoni Pizza').should('be.visible')
    cy.contains('Pizza topped with pepperoni and mozzarella cheese').should('be.visible')
    cy.contains('$18.99').should('be.visible')
  })

  it('shows add to cart buttons for each menu item', () => {
    cy.get('button').contains('Add to Cart').should('be.visible')
    // Check that we have multiple Add to Cart buttons
    cy.get('button').filter(':contains("Add to Cart")').should('have.length', 2)
  })

  it('navigates back to homepage when clicking back link', () => {
    cy.contains('← Back to Restaurants').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.contains('Restaurants Near You').should('be.visible')
  })

  it('handles invalid restaurant id gracefully', () => {
    cy.visit('/restaurant/999')
    cy.contains('Restaurant not found').should('be.visible')
    cy.contains('← Back to Restaurants').should('be.visible')
  })

  it('adds item to cart and updates cart counter', () => {
    // Initially cart should be empty
    cy.contains('Cart (0)').should('be.visible')
    
    // Add first item to cart
    cy.get('button').contains('Add to Cart').first().click()
    
    // Cart counter should update
    cy.contains('Cart (1)').should('be.visible')
    
    // Add second item
    cy.get('button').contains('Add to Cart').last().click()
    
    // Cart counter should update again
    cy.contains('Cart (2)').should('be.visible')
  })

  it('navigates to cart page when clicking cart link', () => {
    // Add an item first
    cy.get('button').contains('Add to Cart').first().click()
    
    // Click cart link
    cy.contains('Cart (1)').click()
    
    // Should navigate to cart page
    cy.url().should('include', '/cart')
    cy.contains('Your Cart').should('be.visible')
  })
})