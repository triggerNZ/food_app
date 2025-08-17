import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/services/OrderService';

const orderService = new OrderService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'restaurantId parameter is required' },
        { status: 400 }
      );
    }

    const activeOrders = await orderService.getActiveOrdersForRestaurant(restaurantId);
    return NextResponse.json(activeOrders);
  } catch (error) {
    console.error('Error fetching active orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active orders' },
      { status: 500 }
    );
  }
}