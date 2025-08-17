import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/services/OrderService';

const orderService = new OrderService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    const statistics = await orderService.getOrderStatistics(
      restaurantId || undefined
    );

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order statistics' },
      { status: 500 }
    );
  }
}