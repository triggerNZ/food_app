'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Restaurant } from '@/types';

export default function CheckoutPage() {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const { cart, getCartTotal, clearCart } = useCart();

  useEffect(() => {
    if (cart.restaurantId) {
      fetchRestaurant(cart.restaurantId);
    }
  }, [cart.restaurantId]);

  const fetchRestaurant = async (restaurantId: string) => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`);
      if (response.ok) {
        const data = await response.json();
        setRestaurant(data);
      }
    } catch (err) {
      console.error('Error fetching restaurant:', err);
    }
  };

  const subtotal = getCartTotal();
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08875; // 8.875% tax
  const total = subtotal + deliveryFee + tax;

  const handlePayNow = async () => {
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessingPayment(false);
    setOrderPlaced(true);
    clearCart();
  };

  if (cart.items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Restaurants
          </Link>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Items to Checkout</h1>
            <p className="text-gray-600 mb-6">Your cart is empty. Add some items first!</p>
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

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600 mb-4">
                Your order from {restaurant?.name} has been placed and is being prepared.
              </p>
              <p className="text-gray-500 text-sm">
                Estimated delivery time: {restaurant?.deliveryTime}
              </p>
            </div>
            
            <div className="space-y-3">
              <Link 
                href="/"
                className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Order More Food
              </Link>
              <button 
                onClick={() => window.print()}
                className="block w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/cart" className="text-blue-600 hover:text-blue-800">
            ← Back to Cart
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <div></div> {/* Spacer for centering */}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            
            {restaurant && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800">{restaurant.name}</h3>
                <p className="text-gray-600 text-sm">{restaurant.cuisine}</p>
                <p className="text-gray-500 text-sm">Delivery: {restaurant.deliveryTime}</p>
              </div>
            )}

            <div className="space-y-3 mb-6" data-testid="order-items">
              {cart.items.map((item) => (
                <div key={item.menuItem.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.menuItem.name}</h4>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium text-gray-900">
                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="text-gray-900">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="text-gray-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input 
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input 
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input 
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input 
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handlePayNow}
              disabled={isProcessingPayment}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                isProcessingPayment
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isProcessingPayment ? 'Processing Payment...' : `Pay Now - $${total.toFixed(2)}`}
            </button>
            
            <p className="text-gray-500 text-xs text-center mt-3">
              This is a demo app. No real payment will be processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}