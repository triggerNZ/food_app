'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { OrderWithItems, OrderStatus, Restaurant } from '@/types';

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
  order_placed: 'bg-blue-100 text-blue-800 border-blue-200',
  order_confirmed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  preparing: 'bg-orange-100 text-orange-800 border-orange-200',
  ready_for_pickup: 'bg-purple-100 text-purple-800 border-purple-200',
  out_for_delivery: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200'
};

const STATUS_ACTIONS: Record<OrderStatus, OrderStatus[]> = {
  order_placed: ['order_confirmed', 'cancelled'],
  order_confirmed: ['preparing', 'cancelled'],
  preparing: ['ready_for_pickup', 'cancelled'],
  ready_for_pickup: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered'],
  delivered: [],
  cancelled: []
};

export default function RestaurantDashboard() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string>('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      fetchOrders();
    }
  }, [selectedRestaurant, filterStatus]);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants');
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      const data = await response.json();
      setRestaurants(data);
      
      // Auto-select first restaurant
      if (data.length > 0) {
        setSelectedRestaurant(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('Failed to load restaurants');
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      let url = `/api/orders?restaurantId=${selectedRestaurant}`;
      
      // Add status filter
      if (filterStatus === 'active') {
        // Active orders are not delivered or cancelled
        url += '&status=order_placed,order_confirmed,preparing,ready_for_pickup,out_for_delivery';
      } else if (filterStatus !== 'all') {
        url += `&status=${filterStatus}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const orderData = await response.json();
      
      // Convert string numbers to actual numbers (PostgreSQL DECIMAL fields come as strings)
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
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh orders to get updated data
      await fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    } finally {
      setUpdatingOrderId('');
    }
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActiveOrders = () => {
    return orders.filter(order => 
      !['delivered', 'cancelled'].includes(order.status)
    );
  };

  const getOrderStats = () => {
    const total = orders.length;
    const active = getActiveOrders().length;
    const delivered = orders.filter(order => order.status === 'delivered').length;
    const revenue = orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.total, 0);

    return { total, active, delivered, revenue };
  };

  const selectedRestaurantData = restaurants.find(r => r.id === selectedRestaurant);
  const stats = getOrderStats();
  const filteredOrders = filterStatus === 'active' ? getActiveOrders() : orders;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
              <p className="text-gray-600">Manage your orders and track performance</p>
            </div>
            <Link 
              href="/"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Restaurant Selector */}
          <div className="flex gap-4 items-center">
            <div>
              <label htmlFor="restaurant-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Restaurant
              </label>
              <select
                id="restaurant-select"
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a restaurant...</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name} - {restaurant.cuisine}
                  </option>
                ))}
              </select>
            </div>

            {selectedRestaurantData && (
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{selectedRestaurantData.name}</h3>
                <p className="text-sm text-gray-600">{selectedRestaurantData.cuisine} • ⭐ {selectedRestaurantData.rating}</p>
              </div>
            )}
          </div>
        </div>

        {!selectedRestaurant ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-2xl">🏪</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Restaurant</h2>
            <p className="text-gray-600">Choose a restaurant from the dropdown above to view and manage orders.</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">📋</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-xl">⏳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Delivered</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.revenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex gap-4 items-center">
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                  Filter Orders:
                </label>
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active Orders</option>
                  <option value="all">All Orders</option>
                  <option value="order_placed">Order Placed</option>
                  <option value="order_confirmed">Order Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready_for_pickup">Ready for Pickup</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={fetchOrders}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
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
                  onClick={fetchOrders}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Orders List */}
            {!loading && !error && (
              <>
                {filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-gray-400 text-2xl">📋</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Found</h2>
                    <p className="text-gray-600 mb-6">
                      {filterStatus === 'active' 
                        ? 'No active orders at the moment.' 
                        : `No orders with status "${filterStatus}".`}
                    </p>
                  </div>
                ) : (
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
                              {order.customerName} • {order.customerPhone}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDateTime(order.createdAt as any)}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${STATUS_COLORS[order.status]}`}>
                              {STATUS_LABELS[order.status]}
                            </div>
                            <p className="text-lg font-semibold text-gray-900 mt-2">
                              ${order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Order Items:</h4>
                          <div className="space-y-1">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.quantity}x {item.menuItem.name}</span>
                                <span>${item.totalPrice.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="mb-4 text-sm text-gray-600">
                          <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                          {order.specialInstructions && (
                            <p><strong>Special Instructions:</strong> {order.specialInstructions}</p>
                          )}
                        </div>

                        {/* Status Actions */}
                        {STATUS_ACTIONS[order.status].length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {STATUS_ACTIONS[order.status].map((nextStatus) => (
                              <button
                                key={nextStatus}
                                onClick={() => updateOrderStatus(order.id, nextStatus)}
                                disabled={updatingOrderId === order.id}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  nextStatus === 'cancelled'
                                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {updatingOrderId === order.id ? 'Updating...' : `Mark as ${STATUS_LABELS[nextStatus]}`}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}