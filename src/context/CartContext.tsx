'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Cart, CartItem, MenuItem } from '@/types';

interface CartState {
  cart: Cart;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: { menuItem: MenuItem; restaurantId: string } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  cart: Cart;
  addItem: (menuItem: MenuItem, restaurantId: string) => void;
  addItemWithWarning: (menuItem: MenuItem, restaurantId: string, onWarning?: (currentRestaurantId: string) => void) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  cart: {
    items: [],
    restaurantId: null
  }
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem, restaurantId } = action.payload;
      
      // If adding from different restaurant, clear cart first
      if (state.cart.restaurantId && state.cart.restaurantId !== restaurantId) {
        return {
          cart: {
            items: [{ menuItem, quantity: 1, restaurantId }],
            restaurantId
          }
        };
      }
      
      // Check if item already exists
      const existingItemIndex = state.cart.items.findIndex(
        item => item.menuItem.id === menuItem.id
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...state.cart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        
        return {
          cart: {
            ...state.cart,
            items: updatedItems,
            restaurantId
          }
        };
      } else {
        // Add new item
        return {
          cart: {
            items: [...state.cart.items, { menuItem, quantity: 1, restaurantId }],
            restaurantId
          }
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.cart.items.filter(
        item => item.menuItem.id !== action.payload.itemId
      );
      
      return {
        cart: {
          items: updatedItems,
          restaurantId: updatedItems.length === 0 ? null : state.cart.restaurantId
        }
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { itemId } });
      }
      
      const updatedItems = state.cart.items.map(item =>
        item.menuItem.id === itemId
          ? { ...item, quantity }
          : item
      );
      
      return {
        cart: {
          ...state.cart,
          items: updatedItems
        }
      };
    }
    
    case 'CLEAR_CART': {
      return initialState;
    }
    
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const addItem = (menuItem: MenuItem, restaurantId: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { menuItem, restaurantId } });
  };
  
  const addItemWithWarning = (
    menuItem: MenuItem, 
    restaurantId: string, 
    onWarning?: (currentRestaurantId: string) => void
  ) => {
    // Check if adding from different restaurant and cart has items
    if (state.cart.restaurantId && 
        state.cart.restaurantId !== restaurantId && 
        state.cart.items.length > 0) {
      
      if (onWarning) {
        onWarning(state.cart.restaurantId);
        return;
      }
    }
    
    // If same restaurant or cart is empty, add directly
    addItem(menuItem, restaurantId);
  };
  
  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const getCartTotal = () => {
    return state.cart.items.reduce(
      (total, item) => total + (item.menuItem.price * item.quantity),
      0
    );
  };
  
  const getCartItemCount = () => {
    return state.cart.items.reduce(
      (count, item) => count + item.quantity,
      0
    );
  };
  
  return (
    <CartContext.Provider value={{
      cart: state.cart,
      addItem,
      addItemWithWarning,
      removeItem,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}