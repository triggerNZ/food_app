import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/services/OrderService';

const orderService = new OrderService();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cancelledOrder = await orderService.cancelOrder(params.id);
    
    if (!cancelledOrder) {
      return NextResponse.json(
        { error: 'Order not found or cannot be cancelled' },
        { status: 404 }
      );
    }

    return NextResponse.json(cancelledOrder);
  } catch (error) {
    console.error('Error cancelling order:', error);
    
    if (error instanceof Error && error.message.includes('Cannot cancel')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}