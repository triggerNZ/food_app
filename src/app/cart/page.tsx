'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { mockRestaurants } from '@/data/mockData';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, getCartTotal, clearCart } = useCart();
  
  const restaurant = cart.restaurantId 
    ? mockRestaurants.find(r => r.id === cart.restaurantId)
    : null;

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Restaurants
          </Link>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Add some delicious items from our restaurants!</p>
            <Link 
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Restaurants
          </Link>
          {cart.restaurantId && (
            <Link 
              href={`/restaurant/${cart.restaurantId}`}
              className="text-blue-600 hover:text-blue-800"
            >
              Continue Shopping at {restaurant?.name}
            </Link>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
            <button 
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Clear Cart
            </button>
          </div>
          
          {restaurant && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800">
                Ordering from: {restaurant.name}
              </h2>
              <p className="text-gray-600 text-sm">{restaurant.cuisine}</p>
            </div>
          )}

          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.menuItem.id} className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.menuItem.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    {item.menuItem.description}
                  </p>
                  <span className="text-lg font-bold text-gray-900">
                    ${item.menuItem.price}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-right min-w-[80px]">
                    <span className="text-lg font-bold text-gray-900">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.menuItem.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-gray-900">
                ${getCartTotal().toFixed(2)}
              </span>
            </div>
            
            <Link 
              href="/checkout"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold text-center block"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}