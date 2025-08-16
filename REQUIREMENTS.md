# Requirements

We are building a restaurant ordering app. Restaurants list their menus. Customers order from the menu and pay, and the restaurant delivers to the customers home.

# Components

## Customer Homepage
Here, the customers can see which restaurants are near them. It also contains a search bar which searches nearby by restaurant name, food type or menu item. Searching replaces the list of nearby restaurants with the search results.

Clicking a restaurant opens the restaurant page.

## Restaurant page
The restaurant page lists the restaurant's menu, including an image, a title, description and price for each item. Each item has an option to add to cart.

## Cart page
This shows the users current cart (for a specific restaurant). Users can change quantities or remove items. There is a button that takes the user to the checkout page.
- A user can only have one cart at a time for one restaurant. If the user attempts to add an item from a different restaurant, they are shown a warning that this will clear the existing cart.

## Checkout page
This shows a list of items in the cart, a subtotal and total, and has a pay now button.

## Payment processor
Payment should take credit card details and forward to a payment processor. Multiple payment processors are supported using a common interface. If the payment is unsuccessful, a message should be shown to the user and the order should not succeed.