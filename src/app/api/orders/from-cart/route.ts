import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/services/OrderService';
import { Cart } from '@/types';

const orderService = new OrderService();

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { cart, customerInfo, paymentInfo, pricing } = requestData;

    // Validate required fields
    if (!cart || !customerInfo || !paymentInfo || !pricing) {
      return NextResponse.json(
        { error: 'Missing required fields: cart, customerInfo, paymentInfo, pricing' },
        { status: 400 }
      );
    }

    // Validate cart
    if (!cart.restaurantId || !cart.items || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty or invalid' },
        { status: 400 }
      );
    }

    // Validate customer info
    if (!customerInfo.customerName || !customerInfo.customerEmail || 
        !customerInfo.deliveryAddress) {
      return NextResponse.json(
        { error: 'Missing required customer information' },
        { status: 400 }
      );
    }

    // Validate payment info
    if (!paymentInfo.paymentMethod) {
      return NextResponse.json(
        { error: 'Missing payment method' },
        { status: 400 }
      );
    }

    // Validate pricing
    if (typeof pricing.subtotal !== 'number' || typeof pricing.total !== 'number') {
      return NextResponse.json(
        { error: 'Invalid pricing information' },
        { status: 400 }
      );
    }

    const order = await orderService.createOrderFromCart(
      cart,
      customerInfo,
      paymentInfo,
      pricing
    );

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order from cart:', error);
    
    if (error instanceof Error && error.message.includes('Cart is empty')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create order from cart' },
      { status: 500 }
    );
  }
}