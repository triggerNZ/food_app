-- Insert restaurants
INSERT INTO restaurants (id, name, cuisine, rating, delivery_time, image, description) VALUES
('1', 'Pizza Palace', 'Italian', 4.5, '25-35 min', '/pizza-palace.jpg', 'Authentic Italian pizza made with fresh ingredients'),
('2', 'Burger Barn', 'American', 4.2, '20-30 min', '/burger-barn.jpg', 'Gourmet burgers and classic American favorites'),
('3', 'Sushi Spot', 'Japanese', 4.7, '30-40 min', '/sushi-spot.jpg', 'Fresh sushi and traditional Japanese dishes');

-- Insert menu items for Pizza Palace (restaurant_id: '1')
INSERT INTO menu_items (id, restaurant_id, name, description, price, image, category) VALUES
('1-1', '1', 'Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 16.99, '/margherita.jpg', 'Pizza'),
('1-2', '1', 'Pepperoni Pizza', 'Pizza topped with pepperoni and mozzarella cheese', 18.99, '/pepperoni.jpg', 'Pizza');

-- Insert menu items for Burger Barn (restaurant_id: '2')
INSERT INTO menu_items (id, restaurant_id, name, description, price, image, category) VALUES
('2-1', '2', 'Classic Burger', 'Beef patty with lettuce, tomato, onion, and special sauce', 12.99, '/classic-burger.jpg', 'Burgers'),
('2-2', '2', 'Chicken Sandwich', 'Grilled chicken breast with avocado and chipotle mayo', 13.99, '/chicken-sandwich.jpg', 'Sandwiches');

-- Insert menu items for Sushi Spot (restaurant_id: '3')
INSERT INTO menu_items (id, restaurant_id, name, description, price, image, category) VALUES
('3-1', '3', 'Salmon Roll', 'Fresh salmon with cucumber and avocado', 8.99, '/salmon-roll.jpg', 'Sushi'),
('3-2', '3', 'Chicken Teriyaki', 'Grilled chicken with teriyaki sauce and steamed rice', 15.99, '/chicken-teriyaki.jpg', 'Entrees');

-- Insert sample orders
INSERT INTO orders (
    id, restaurant_id, customer_name, customer_email, customer_phone, delivery_address,
    status, subtotal, tax, delivery_fee, total, payment_method, payment_transaction_id,
    estimated_delivery_time, special_instructions, created_at, updated_at
) VALUES
(
    'order_001', '1', 'John Doe', 'john@example.com', '555-0123', '123 Main St, Anytown, ST 12345',
    'delivered', 35.98, 2.88, 3.99, 42.85, 'Stripe', 'pi_1234567890',
    '2024-01-15 19:30:00', 'Please ring doorbell', '2024-01-15 18:00:00', '2024-01-15 19:25:00'
),
(
    'order_002', '2', 'Jane Smith', 'jane@example.com', '555-0456', '456 Oak Ave, Springfield, ST 54321',
    'out_for_delivery', 26.98, 2.16, 2.99, 32.13, 'PayPal', 'PAYID-ABCDEF',
    '2024-01-16 13:15:00', '', '2024-01-16 12:30:00', '2024-01-16 12:45:00'
),
(
    'order_003', '3', 'Bob Johnson', 'bob@example.com', '555-0789', '789 Pine Rd, Riverside, ST 67890',
    'preparing', 24.98, 2.00, 3.50, 30.48, 'Stripe', 'pi_0987654321',
    '2024-01-16 14:00:00', 'Extra wasabi please', '2024-01-16 13:20:00', '2024-01-16 13:25:00'
),
(
    'order_004', '1', 'Alice Brown', 'alice@example.com', '555-0321', '321 Elm St, Townville, ST 13579',
    'order_confirmed', 16.99, 1.36, 2.99, 21.34, 'Mock', 'mock_tx_456',
    '2024-01-16 15:30:00', '', '2024-01-16 14:45:00', '2024-01-16 14:50:00'
),
(
    'order_005', '2', 'Charlie Wilson', 'charlie@example.com', '555-0654', '654 Maple Dr, Hilltown, ST 24680',
    'cancelled', 13.99, 1.12, 2.99, 18.10, 'Stripe', 'pi_1122334455',
    NULL, 'Leave at door', '2024-01-15 16:00:00', '2024-01-15 16:30:00'
);

-- Insert sample order items
INSERT INTO order_items (id, order_id, menu_item_id, quantity, unit_price, total_price) VALUES
-- Order 001 items (John Doe - Pizza Palace)
('item_001_1', 'order_001', '1-1', 1, 16.99, 16.99),
('item_001_2', 'order_001', '1-2', 1, 18.99, 18.99),

-- Order 002 items (Jane Smith - Burger Barn)
('item_002_1', 'order_002', '2-1', 2, 12.99, 25.98),
('item_002_2', 'order_002', '2-2', 1, 13.99, 13.99),

-- Order 003 items (Bob Johnson - Sushi Spot)
('item_003_1', 'order_003', '3-1', 2, 8.99, 17.98),
('item_003_2', 'order_003', '3-2', 1, 15.99, 15.99),

-- Order 004 items (Alice Brown - Pizza Palace)
('item_004_1', 'order_004', '1-1', 1, 16.99, 16.99),

-- Order 005 items (Charlie Wilson - Burger Barn - Cancelled)
('item_005_1', 'order_005', '2-2', 1, 13.99, 13.99);
