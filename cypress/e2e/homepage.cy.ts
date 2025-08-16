describe('Homepage - Restaurant Listing', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the homepage title and description', () => {
    cy.contains('Restaurants Near You').should('be.visible')
    cy.contains('Discover great food from local restaurants').should('be.visible')
  })

  it('displays restaurant cards with correct information', () => {
    // Check that restaurant cards are displayed
    cy.get('[data-testid="restaurant-card"]').should('have.length', 3)
    
    // Check specific restaurant details
    cy.contains('Pizza Palace').should('be.visible')
    cy.contains('Italian').should('be.visible')
    cy.contains('4.5').should('be.visible')
    cy.contains('25-35 min').should('be.visible')
    
    cy.contains('Burger Barn').should('be.visible')
    cy.contains('American').should('be.visible')
    cy.contains('4.2').should('be.visible')
    
    cy.contains('Sushi Spot').should('be.visible')
    cy.contains('Japanese').should('be.visible')
    cy.contains('4.7').should('be.visible')
  })

  it('navigates to restaurant page when clicking on a restaurant card', () => {
    cy.contains('Pizza Palace').click()
    cy.url().should('include', '/restaurant/1')
    cy.contains('Pizza Palace').should('be.visible')
  })

  it('shows restaurant ratings and delivery times', () => {
    // Check that star ratings are displayed for each restaurant
    cy.get('span').contains('★').should('be.visible')
    
    // Check specific ratings are displayed
    cy.contains('4.5').should('be.visible')
    cy.contains('4.2').should('be.visible') 
    cy.contains('4.7').should('be.visible')
    
    // Check delivery times are displayed
    cy.contains('25-35 min').should('be.visible')
    cy.contains('20-30 min').should('be.visible')
    cy.contains('30-40 min').should('be.visible')
  })

  it('displays restaurant descriptions', () => {
    cy.contains('Authentic Italian pizza made with fresh ingredients').should('be.visible')
    cy.contains('Gourmet burgers and classic American favorites').should('be.visible')
    cy.contains('Fresh sushi and traditional Japanese dishes').should('be.visible')
  })

  it('has a search input field', () => {
    cy.get('[data-testid="search-input"]').should('be.visible')
    cy.get('[data-testid="search-input"]').should('have.attr', 'placeholder', 'Search restaurants, cuisine, or menu items...')
  })

  it('filters restaurants by name when searching', () => {
    // Search for Pizza Palace
    cy.get('[data-testid="search-input"]').type('Pizza')
    cy.get('[data-testid="restaurant-card"]').should('have.length', 1)
    cy.contains('Pizza Palace').should('be.visible')
    cy.contains('Burger Barn').should('not.exist')
    cy.contains('Sushi Spot').should('not.exist')
  })

  it('filters restaurants by cuisine type when searching', () => {
    // Search for Italian cuisine
    cy.get('[data-testid="search-input"]').type('Italian')
    cy.get('[data-testid="restaurant-card"]').should('have.length', 1)
    cy.contains('Pizza Palace').should('be.visible')
    cy.contains('Burger Barn').should('not.exist')
    cy.contains('Sushi Spot').should('not.exist')
  })

  it('filters restaurants by menu items when searching', () => {
    // Search for Margherita (menu item in Pizza Palace)
    cy.get('[data-testid="search-input"]').type('Margherita')
    cy.get('[data-testid="restaurant-card"]').should('have.length', 1)
    cy.contains('Pizza Palace').should('be.visible')
    cy.contains('Burger Barn').should('not.exist')
    cy.contains('Sushi Spot').should('not.exist')
  })

  it('shows all restaurants when search is cleared', () => {
    // Search for something first
    cy.get('[data-testid="search-input"]').type('Pizza')
    cy.get('[data-testid="restaurant-card"]').should('have.length', 1)
    
    // Clear the search
    cy.get('[data-testid="search-input"]').clear()
    cy.get('[data-testid="restaurant-card"]').should('have.length', 3)
    cy.contains('Pizza Palace').should('be.visible')
    cy.contains('Burger Barn').should('be.visible')
    cy.contains('Sushi Spot').should('be.visible')
  })

  it('shows no results when search does not match anything', () => {
    cy.get('[data-testid="search-input"]').type('nonexistentrestaurant')
    cy.get('[data-testid="restaurant-card"]').should('have.length', 0)
  })
})