# Order Management API Endpoints

## Orders

### GET /api/orders
Get all orders or filter by parameters
- **Query Parameters:**
  - `customerEmail` - Filter by customer email
  - `restaurantId` - Filter by restaurant ID
  - `status` - Filter by order status
- **Response:** Array of Order objects

### POST /api/orders
Create a new order
- **Body:** CreateOrderData object
- **Response:** Created Order object

### GET /api/orders/[id]
Get a specific order by ID
- **Query Parameters:**
  - `includeItems=true` - Include order items and menu item details
- **Response:** Order or OrderWithItems object

### PATCH /api/orders/[id]
Update an order
- **Body Options:**
  - `{ status: OrderStatus }` - Update order status
  - `{ estimatedDeliveryTime: string }` - Update estimated delivery time
- **Response:** Updated Order object

### DELETE /api/orders/[id]
Delete an order
- **Response:** Success message

### POST /api/orders/[id]/cancel
Cancel an order
- **Response:** Updated Order object with cancelled status

### POST /api/orders/from-cart
Create an order from cart data (used by checkout)
- **Body:**
  ```json
  {
    "cart": Cart,
    "customerInfo": {
      "customerName": string,
      "customerEmail": string,
      "customerPhone": string,
      "deliveryAddress": string,
      "specialInstructions"?: string
    },
    "paymentInfo": {
      "paymentMethod": string,
      "paymentTransactionId"?: string
    },
    "pricing": {
      "subtotal": number,
      "tax": number,
      "deliveryFee": number,
      "total": number
    }
  }
  ```
- **Response:** Created Order object

### GET /api/orders/active
Get active orders for a restaurant
- **Query Parameters:**
  - `restaurantId` (required) - Restaurant ID
- **Response:** Array of active Order objects

### GET /api/orders/statistics
Get order statistics
- **Query Parameters:**
  - `restaurantId` (optional) - Filter by restaurant ID
- **Response:**
  ```json
  {
    "totalOrders": number,
    "ordersByStatus": Record<OrderStatus, number>,
    "totalRevenue": number,
    "averageOrderValue": number
  }
  ```

## Order Status Values
- `order_placed` - Payment confirmed, order sent to restaurant
- `order_confirmed` - Restaurant has accepted the order
- `preparing` - Restaurant is cooking/preparing the food
- `ready_for_pickup` - Food is ready, waiting for delivery driver
- `out_for_delivery` - Driver has picked up the order and is en route
- `delivered` - Order has been delivered to customer
- `cancelled` - Order was cancelled

## Example Usage

### Create Order from Cart
```javascript
const response = await fetch('/api/orders/from-cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cart,
    customerInfo: {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '555-0123',
      deliveryAddress: '123 Main St'
    },
    paymentInfo: {
      paymentMethod: 'Stripe',
      paymentTransactionId: 'pi_1234567890'
    },
    pricing: {
      subtotal: 25.98,
      tax: 2.08,
      deliveryFee: 3.99,
      total: 32.05
    }
  })
});
```

### Update Order Status
```javascript
const response = await fetch('/api/orders/order_123', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'preparing' })
});
```

### Get Order with Items
```javascript
const response = await fetch('/api/orders/order_123?includeItems=true');
const orderWithItems = await response.json();
```