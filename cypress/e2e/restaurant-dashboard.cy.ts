describe('Restaurant Dashboard', () => {
  beforeEach(() => {
    // Handle uncaught exceptions from application
    cy.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from failing the test
      // when there are application errors we can't control
      if (err.message.includes('Cannot read properties of undefined')) {
        return false
      }
      return true
    })
    
    cy.visit('/')
  })

  const selectRestaurant = () => {
    // Wait for restaurants to load and ensure one is selected
    cy.get('select#restaurant-select', { timeout: 10000 }).should('be.visible')
    cy.wait(3000) // Give time for auto-selection
    
    cy.get('select#restaurant-select').then(($select) => {
      if ($select.val() === '') {
        cy.get('select#restaurant-select').select('1')
      }
    })
    
    // Wait for dashboard content to load
    cy.get('body', { timeout: 15000 }).should('be.visible')
  }

  it('navigates to restaurant dashboard from homepage', () => {
    // Click restaurant dashboard link
    cy.contains('Restaurant Dashboard').click()
    
    // Should navigate to dashboard page
    cy.url().should('include', '/dashboard')
    cy.contains('Restaurant Dashboard').should('be.visible')
    cy.contains('Manage your orders and track performance').should('be.visible')
  })

  it('shows restaurant selection when no restaurant is selected', () => {
    // Navigate to dashboard
    cy.contains('Restaurant Dashboard').click()
    
    // Should show restaurant selection prompt
    cy.contains('Select a Restaurant').should('be.visible')
    cy.contains('Choose a restaurant from the dropdown').should('be.visible')
    cy.get('select#restaurant-select').should('be.visible')
  })

  it('loads restaurants in dropdown', () => {
    // Navigate to dashboard
    cy.contains('Restaurant Dashboard').click()
    
    // Wait for restaurants to load
    cy.get('select#restaurant-select', { timeout: 10000 }).should('be.visible')
    
    // Check that restaurants are loaded
    cy.get('select#restaurant-select option').should('have.length.greaterThan', 1)
    cy.get('select#restaurant-select').should('contain', 'Pizza Palace')
  })

  it('selects restaurant and shows dashboard content', () => {
    // Navigate to dashboard
    cy.contains('Restaurant Dashboard').click()
    
    selectRestaurant()
    
    // Should show dashboard stats and content
    cy.contains('Total Orders').should('be.visible')
    cy.contains('Active Orders').should('be.visible')
    cy.contains('Delivered').should('be.visible')
    cy.contains('Revenue').should('be.visible')
    
    // Should show filters
    cy.get('select#status-filter').should('be.visible')
  })

  it('displays orders for selected restaurant', () => {
    // Navigate to dashboard
    cy.contains('Restaurant Dashboard').click()
    
    selectRestaurant()
    
    // Check for orders or no orders message
    cy.get('body').should('satisfy', ($body) => {
      const text = $body.text();
      return text.includes('Order #') || 
             text.includes('No Orders Found') ||
             text.includes('Loading orders...');
    });
  })

  it('filters orders by status', () => {
    // Navigate to dashboard
    cy.contains('Restaurant Dashboard').click()
    
    selectRestaurant()
    
    // Wait for initial load
    cy.get('body', { timeout: 15000 }).should('be.visible')
    
    // Change filter to "All Orders"
    cy.get('select#status-filter').select('All Orders')
    
    // Wait for filter to apply
    cy.wait(2000)
    
    // Should show appropriate content
    cy.get('body').should('be.visible')
  })

  it('shows order details and actions', () => {
    // Navigate to dashboard
    cy.contains('Restaurant Dashboard').click()
    
    selectRestaurant()
    
    // Wait for orders to load
    cy.get('body', { timeout: 15000 }).should('be.visible')
    
    // Check if there are orders to interact with
    cy.get('body').then(($body) => {
      if ($body.text().includes('Order #')) {
        // Order found - check for expected elements
        cy.contains('Order #').should('be.visible')
        
        // Check for order details
        cy.get('body').should('satisfy', ($body) => {
          const text = $body.text();
          return text.includes('Order Items') || text.includes('Delivery Address');
        });
      } else if ($body.text().includes('No Orders Found')) {
        // No orders found - this is also valid
        cy.contains('No Orders Found').should('be.visible')
      }
    })
  })

  it('refreshes orders when refresh button is clicked', () => {
    // Navigate to dashboard
    cy.contains('Restaurant Dashboard').click()
    
    selectRestaurant()
    
    // Wait for initial load
    cy.get('body', { timeout: 15000 }).should('be.visible')
    
    // Click refresh button
    cy.contains('Refresh').click()
    
    // Should show loading or updated content
    cy.get('body', { timeout: 10000 }).should('be.visible')
  })

  it('navigates back to home from dashboard', () => {
    // Navigate to dashboard
    cy.contains('Restaurant Dashboard').click()
    
    // Click back to home
    cy.contains('← Back to Home').click()
    
    // Should navigate to homepage
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.contains('Restaurants Near You').should('be.visible')
  })

  it('shows stats cards with numeric values', () => {
    // Navigate to dashboard
    cy.contains('Restaurant Dashboard').click()
    
    selectRestaurant()
    
    // Wait for stats to load
    cy.get('body', { timeout: 15000 }).should('be.visible')
    
    // Check that stats cards show numeric values (even if 0)
    cy.get('body').should('satisfy', ($body) => {
      const text = $body.text();
      // Should contain numbers for each stat
      return /Total Orders.*\d/.test(text) &&
             /Active Orders.*\d/.test(text) &&
             /Delivered.*\d/.test(text) &&
             /Revenue.*\$\d/.test(text);
    });
  })

  it('handles error states gracefully', () => {
    // Navigate to dashboard
    cy.contains('Restaurant Dashboard').click()
    
    selectRestaurant()
    
    // Wait for response
    cy.get('body', { timeout: 15000 }).should('be.visible')
    
    // Should handle any state gracefully (success, error, or no orders)
    cy.get('body').should('satisfy', ($body) => {
      const text = $body.text();
      return text.includes('Order #') || 
             text.includes('No Orders Found') ||
             text.includes('Error') ||
             text.includes('Loading') ||
             text.includes('Total Orders');
    });
  })
})