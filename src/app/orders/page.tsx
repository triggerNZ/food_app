'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { OrderWithItems, OrderStatus } from '@/types';

const STATUS_LABELS = {
  order_placed: 'Order Placed',
  order_confirmed: 'Order Confirmed',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for Pickup',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

const STATUS_COLORS = {
  order_placed: 'bg-blue-100 text-blue-800',
  order_confirmed: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready_for_pickup: 'bg-purple-100 text-purple-800',
  out_for_delivery: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  const fetchOrders = async (email: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders?customerEmail=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setOrders([]);
          setError('');
        } else {
          setError('Failed to fetch orders');
        }
        return;
      }

      const orderData = await response.json();
      
      // Convert string numbers to actual numbers and dates to proper format
      const processedOrders = orderData.map((order: any) => ({
        ...order,
        subtotal: parseFloat(order.subtotal || 0),
        tax: parseFloat(order.tax || 0),
        deliveryFee: parseFloat(order.deliveryFee || 0),
        total: parseFloat(order.total || 0),
        createdAt: order.createdAt, // Keep as string for date operations
        items: order.items?.map((item: any) => ({
          ...item,
          unitPrice: parseFloat(item.unitPrice || 0),
          totalPrice: parseFloat(item.totalPrice || 0),
          menuItem: {
            ...item.menuItem,
            price: parseFloat(item.menuItem?.price || 0)
          }
        })) || []
      }));
      
      setOrders(processedOrders);
      setError('');
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerEmail.trim()) {
      fetchOrders(customerEmail.trim());
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filterOrders = (orders: OrderWithItems[]): OrderWithItems[] => {
    let filtered = [...orders];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();

      switch (dateRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter(order => 
        new Date(order.createdAt as any) >= cutoffDate
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => 
      new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime()
    );
  };

  const filteredOrders = filterOrders(orders);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Restaurants
          </Link>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order History</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your email to view order history
                </label>
                <input
                  type="email"
                  id="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Search Orders
                </button>
              </div>
            </div>
          </form>

          {/* Filters */}
          {orders.length > 0 && (
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Status
                </label>
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Orders</option>
                  <option value="order_placed">Order Placed</option>
                  <option value="order_confirmed">Order Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready_for_pickup">Ready for Pickup</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Date
                </label>
                <select
                  id="date-filter"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                  <option value="3months">Past 3 Months</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => customerEmail && fetchOrders(customerEmail)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Orders State */}
        {!loading && !error && orders.length === 0 && customerEmail && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">📋</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any orders for {customerEmail}. Start by placing your first order!
            </p>
            <Link 
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Browse Restaurants
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
              </h2>
            </div>

            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <p className="text-gray-600">
                      {order.restaurant?.name || 'Restaurant'} • {order.restaurant?.cuisine || 'Cuisine'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt as any)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mt-2">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Items Summary */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}:
                  </p>
                  <div className="text-sm text-gray-800">
                    {order.items.map((item, index) => (
                      <span key={item.id}>
                        {item.quantity}x {item.menuItem.name}
                        {index < order.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Track Order
                  </Link>
                  
                  {order.restaurant?.id ? (
                    <Link
                      href={`/restaurant/${order.restaurant.id}`}
                      className="flex-1 bg-gray-200 text-gray-800 text-center py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Order Again
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="flex-1 bg-gray-100 text-gray-400 text-center py-2 px-4 rounded-lg cursor-not-allowed"
                    >
                      Restaurant Unavailable
                    </button>
                  )}
                  
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => window.print()}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Print Receipt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results After Filtering */}
        {!loading && !error && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-yellow-600 text-2xl">🔍</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Match Your Filters</h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your status or date filters to see more orders.
            </p>
            <button 
              onClick={() => {
                setFilterStatus('all');
                setDateRange('all');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}