import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/services/OrderService';
import { OrderStatus } from '@/types';

const orderService = new OrderService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const includeItems = searchParams.get('includeItems') === 'true';

    let order;
    if (includeItems) {
      order = await orderService.getOrderWithItems(params.id);
    } else {
      order = await orderService.getOrderById(params.id);
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();

    // Handle status updates
    if (updates.status) {
      const validStatuses: OrderStatus[] = [
        'order_placed', 'order_confirmed', 'preparing', 
        'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'
      ];

      if (!validStatuses.includes(updates.status)) {
        return NextResponse.json(
          { error: 'Invalid order status' },
          { status: 400 }
        );
      }

      const updatedOrder = await orderService.updateOrderStatus(params.id, updates.status);
      
      if (!updatedOrder) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(updatedOrder);
    }

    // Handle estimated delivery time updates
    if (updates.estimatedDeliveryTime) {
      const estimatedTime = new Date(updates.estimatedDeliveryTime);
      const updatedOrder = await orderService.updateEstimatedDeliveryTime(params.id, estimatedTime);
      
      if (!updatedOrder) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(updatedOrder);
    }

    return NextResponse.json(
      { error: 'No valid updates provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await orderService.deleteOrder(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}