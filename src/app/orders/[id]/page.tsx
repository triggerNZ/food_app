'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { OrderWithItems, OrderStatus } from '@/types';

const ORDER_STATUS_FLOW: OrderStatus[] = [
  'order_placed',
  'order_confirmed', 
  'preparing',
  'ready_for_pickup',
  'out_for_delivery',
  'delivered'
];

const STATUS_LABELS = {
  order_placed: 'Order Placed',
  order_confirmed: 'Order Confirmed',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for Pickup',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

const STATUS_DESCRIPTIONS = {
  order_placed: 'Your order has been placed and payment confirmed',
  order_confirmed: 'Restaurant has confirmed your order',
  preparing: 'Your food is being prepared',
  ready_for_pickup: 'Food is ready and waiting for pickup',
  out_for_delivery: 'Your order is on the way',
  delivered: 'Order has been delivered',
  cancelled: 'This order was cancelled'
};

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}?includeItems=true`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Order not found');
        } else {
          setError('Failed to fetch order details');
        }
        return;
      }

      const orderData = await response.json();
      setOrder(orderData);
      setError('');
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;

    // Initial fetch
    fetchOrder();

    // Set up polling for real-time updates (every 10 seconds)
    const pollInterval = setInterval(() => {
      // Only poll if order is not in final state
      if (order && !['delivered', 'cancelled'].includes(order.status)) {
        fetchOrder();
      }
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [orderId, order?.status]);

  const getCurrentStatusIndex = (status: OrderStatus): number => {
    if (status === 'cancelled') return -1;
    return ORDER_STATUS_FLOW.indexOf(status);
  };

  const getStatusIcon = (status: OrderStatus, currentStatus: OrderStatus): string => {
    const currentIndex = getCurrentStatusIndex(currentStatus);
    const statusIndex = ORDER_STATUS_FLOW.indexOf(status);
    
    if (currentStatus === 'cancelled') {
      return '❌';
    }
    
    if (statusIndex <= currentIndex) {
      return '✅';
    } else {
      return '⏳';
    }
  };

  const formatEstimatedTime = (date: string | Date | null): string => {
    if (!date) return 'Calculating...';
    
    const estimatedTime = new Date(date);
    const now = new Date();
    
    if (estimatedTime <= now) {
      return 'Very soon';
    }
    
    const diffMinutes = Math.ceil((estimatedTime.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Restaurants
          </Link>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
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

  if (!order) return null;

  const currentStatusIndex = getCurrentStatusIndex(order.status);
  const isCancelled = order.status === 'cancelled';
  const isDelivered = order.status === 'delivered';

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Restaurants
          </Link>
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
              <p className="text-gray-600">
                From {order.restaurant.name} • {order.restaurant.cuisine}
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                isCancelled 
                  ? 'bg-red-100 text-red-800'
                  : isDelivered 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
              }`}>
                {STATUS_LABELS[order.status]}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Order Total:</span>
              <p className="font-semibold">${order.total.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-gray-500">Payment Method:</span>
              <p className="font-semibold">{order.paymentMethod}</p>
            </div>
            <div>
              <span className="text-gray-500">Estimated Delivery:</span>
              <p className="font-semibold">
                {order.estimatedDeliveryTime 
                  ? formatEstimatedTime(order.estimatedDeliveryTime)
                  : 'Calculating...'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>
          
          {!isCancelled ? (
            <div className="space-y-4">
              {ORDER_STATUS_FLOW.map((status, index) => (
                <div key={status} className="flex items-center">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    index <= currentStatusIndex 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {getStatusIcon(status, order.status)}
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <h3 className={`font-medium ${
                      index <= currentStatusIndex ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {STATUS_LABELS[status]}
                    </h3>
                    <p className={`text-sm ${
                      index <= currentStatusIndex ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {STATUS_DESCRIPTIONS[status]}
                    </p>
                  </div>
                  
                  {index === currentStatusIndex && (
                    <div className="text-sm text-blue-600 font-medium">
                      Current
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center p-4 bg-red-50 rounded-lg">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600">❌</span>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-red-900">Order Cancelled</h3>
                <p className="text-sm text-red-600">{STATUS_DESCRIPTIONS.cancelled}</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
          
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.menuItem.name}</h3>
                  <p className="text-gray-600 text-sm">{item.menuItem.description}</p>
                  <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${item.totalPrice.toFixed(2)}</p>
                  <p className="text-gray-500 text-sm">${item.unitPrice.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="text-gray-900">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="text-gray-900">${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-medium text-gray-900">Total:</span>
                <span className="font-medium text-gray-900">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Customer Details</h3>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600">Name: <span className="text-gray-900">{order.customerName}</span></p>
                <p className="text-gray-600">Email: <span className="text-gray-900">{order.customerEmail}</span></p>
                <p className="text-gray-600">Phone: <span className="text-gray-900">{order.customerPhone}</span></p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Delivery Address</h3>
              <p className="text-gray-900 text-sm">{order.deliveryAddress}</p>
              
              {order.specialInstructions && (
                <div className="mt-3">
                  <h4 className="font-medium text-gray-900 mb-1">Special Instructions</h4>
                  <p className="text-gray-600 text-sm">{order.specialInstructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/"
              className="flex-1 bg-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Order More Food
            </Link>
            
            {order.restaurant && (
              <Link 
                href={`/restaurant/${order.restaurant.id}`}
                className="flex-1 bg-gray-200 text-gray-800 text-center py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Order from {order.restaurant.name} Again
              </Link>
            )}
            
            <button 
              onClick={() => window.print()}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}