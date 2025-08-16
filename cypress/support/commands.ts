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
export {}; // Make this a module
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
    interface Chainable<Subject = any> {
      addItemToCart(restaurantName: string, itemIndex?: number): Chainable<Subject>
      goToCart(): Chainable<Subject>
      clearCart(): Chainable<Subject>
    }
  }
}