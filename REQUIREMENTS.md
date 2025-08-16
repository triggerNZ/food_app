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

## Live Order Tracking
After a successful payment, customers should be able to track their order in real-time through multiple stages. The system should provide live updates on order progress and estimated delivery times.

### Order Status Flow
Orders progress through the following stages:
1. **Order Placed** - Payment confirmed, order sent to restaurant
2. **Order Confirmed** - Restaurant has accepted the order
3. **Preparing** - Restaurant is cooking/preparing the food
4. **Ready for Pickup** - Food is ready, waiting for delivery driver
5. **Out for Delivery** - Driver has picked up the order and is en route
6. **Delivered** - Order has been delivered to customer

### Order Tracking Page
- Displays current order status with visual progress indicator
- Shows estimated delivery time that updates based on current stage
- Lists all ordered items with quantities and prices
- Shows restaurant details and contact information
- Displays delivery address
- Shows order total and payment method used
- Provides order ID for reference

### Real-time Updates
- Order status updates automatically without page refresh
- Push notifications sent to customer when status changes
- Estimated delivery time recalculates based on current progress
- Live tracking map showing delivery driver location (when out for delivery)

### Order History
- Customers can view all past orders
- Each historical order shows final status (Delivered/Cancelled)
- Reorder functionality for past orders
- Order receipts available for download

### Restaurant Interface
- Restaurants can update order status through their dashboard
- Automatic status progression with manual override capability
- Estimated preparation times based on menu items
- Notification system for new incoming orders