import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/services/OrderService';
import { CreateOrderData } from '@/types';

const orderService = new OrderService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerEmail = searchParams.get('customerEmail');
    const restaurantId = searchParams.get('restaurantId');
    const status = searchParams.get('status');

    let orders;

    if (customerEmail) {
      orders = await orderService.getOrdersByCustomerEmail(customerEmail);
    } else if (restaurantId) {
      orders = await orderService.getOrdersByRestaurant(restaurantId);
    } else if (status) {
      orders = await orderService.getOrdersByStatus(status as any);
    } else {
      orders = await orderService.getAllOrders();
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData: CreateOrderData = await request.json();

    // Validate required fields
    if (!orderData.restaurantId || !orderData.customerName || !orderData.customerEmail || 
        !orderData.deliveryAddress || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required order fields' },
        { status: 400 }
      );
    }

    const order = await orderService.createOrder(orderData);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}