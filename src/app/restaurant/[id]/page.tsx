'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockRestaurants, mockMenuItems } from '@/data/mockData';
import { Restaurant, MenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import CartWarningModal from '@/components/CartWarningModal';

interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const [id, setId] = useState<string>('');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingItem, setPendingItem] = useState<MenuItem | null>(null);
  const { addItem, addItemWithWarning, getCartItemCount, cart } = useCart();
  
  const currentCartRestaurant = cart.restaurantId 
    ? mockRestaurants.find(r => r.id === cart.restaurantId)
    : null;

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      const foundRestaurant = mockRestaurants.find(r => r.id === id);
      setRestaurant(foundRestaurant || null);
      setMenuItems(mockMenuItems[id] || []);
    });
  }, [params]);
  
  const handleAddToCart = (item: MenuItem) => {
    addItemWithWarning(item, id, () => {
      setPendingItem(item);
      setShowWarning(true);
    });
  };
  
  const handleConfirmClearCart = () => {
    if (pendingItem) {
      addItem(pendingItem, id);
      setPendingItem(null);
    }
    setShowWarning(false);
  };
  
  const handleCancelWarning = () => {
    setPendingItem(null);
    setShowWarning(false);
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Restaurants
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Restaurant not found</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Restaurants
          </Link>
          <Link href="/cart" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Cart ({getCartItemCount()})
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
            <span className="text-gray-400">{restaurant.name} Header Image</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
          <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
          <p className="text-gray-500 mb-4">{restaurant.description}</p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="text-gray-700 ml-1">{restaurant.rating}</span>
            </div>
            <span className="text-gray-500">{restaurant.deliveryTime}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
          
          {menuItems.length === 0 ? (
            <p className="text-gray-500">No menu items available</p>
          ) : (
            <div className="grid gap-4">
              {menuItems.map((item) => (
                <div key={item.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {item.description}
                      </p>
                      <span className="text-lg font-bold text-gray-900">
                        ${item.price}
                      </span>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs text-center">
                          {item.name} Image
                        </span>
                      </div>
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <CartWarningModal
          isOpen={showWarning}
          onClose={handleCancelWarning}
          onConfirm={handleConfirmClearCart}
          currentRestaurant={currentCartRestaurant || null}
          newRestaurant={restaurant}
        />
      </div>
    </div>
  );
}