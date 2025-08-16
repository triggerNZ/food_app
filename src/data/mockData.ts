import { Restaurant, MenuItem } from '@/types';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Palace',
    cuisine: 'Italian',
    rating: 4.5,
    deliveryTime: '25-35 min',
    image: '/pizza-palace.jpg',
    description: 'Authentic Italian pizza made with fresh ingredients'
  },
  {
    id: '2', 
    name: 'Burger Barn',
    cuisine: 'American',
    rating: 4.2,
    deliveryTime: '20-30 min',
    image: '/burger-barn.jpg',
    description: 'Gourmet burgers and classic American favorites'
  },
  {
    id: '3',
    name: 'Sushi Spot',
    cuisine: 'Japanese',
    rating: 4.7,
    deliveryTime: '30-40 min',
    image: '/sushi-spot.jpg',
    description: 'Fresh sushi and traditional Japanese dishes'
  }
];

export const mockMenuItems: Record<string, MenuItem[]> = {
  '1': [
    {
      id: '1-1',
      restaurantId: '1',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and basil',
      price: 16.99,
      image: '/margherita.jpg',
      category: 'Pizza'
    },
    {
      id: '1-2',
      restaurantId: '1',
      name: 'Pepperoni Pizza',
      description: 'Pizza topped with pepperoni and mozzarella cheese',
      price: 18.99,
      image: '/pepperoni.jpg',
      category: 'Pizza'
    }
  ],
  '2': [
    {
      id: '2-1',
      restaurantId: '2',
      name: 'Classic Burger',
      description: 'Beef patty with lettuce, tomato, onion, and special sauce',
      price: 12.99,
      image: '/classic-burger.jpg',
      category: 'Burgers'
    },
    {
      id: '2-2',
      restaurantId: '2',
      name: 'Chicken Sandwich',
      description: 'Grilled chicken breast with avocado and chipotle mayo',
      price: 13.99,
      image: '/chicken-sandwich.jpg',
      category: 'Sandwiches'
    }
  ],
  '3': [
    {
      id: '3-1',
      restaurantId: '3',
      name: 'Salmon Roll',
      description: 'Fresh salmon with cucumber and avocado',
      price: 8.99,
      image: '/salmon-roll.jpg',
      category: 'Sushi'
    },
    {
      id: '3-2',
      restaurantId: '3',
      name: 'Chicken Teriyaki',
      description: 'Grilled chicken with teriyaki sauce and steamed rice',
      price: 15.99,
      image: '/chicken-teriyaki.jpg',
      category: 'Entrees'
    }
  ]
};