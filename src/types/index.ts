export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
  description: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
}

export interface Cart {
  items: CartItem[];
  restaurantId: string | null;
}