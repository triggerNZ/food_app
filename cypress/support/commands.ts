/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom commands for food app testing
Cypress.Commands.add('addItemToCart', (restaurantName: string, itemIndex: number = 0) => {
  cy.visit('/')
  cy.contains(restaurantName).click()
  cy.get('button').contains('Add to Cart').eq(itemIndex).click()
})

Cypress.Commands.add('goToCart', () => {
  cy.get('a').contains('Cart').click()
})

Cypress.Commands.add('clearCart', () => {
  cy.visit('/cart')
  cy.get('button').contains('Clear Cart').click()
})

// Declare custom commands for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      addItemToCart(restaurantName: string, itemIndex?: number): Chainable<void>
      goToCart(): Chainable<void>
      clearCart(): Chainable<void>
    }
  }
}