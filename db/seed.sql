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
