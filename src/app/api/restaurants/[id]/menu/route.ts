import { NextRequest, NextResponse } from 'next/server';
import { RestaurantService } from '@/services/RestaurantService';

const restaurantService = new RestaurantService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    let menuItems;

    if (search) {
      menuItems = await restaurantService.searchMenuItems(search, id);
    } else if (category) {
      menuItems = await restaurantService.getMenuItemsByCategory(category, id);
    } else {
      menuItems = await restaurantService.getRestaurantMenu(id);
    }

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}