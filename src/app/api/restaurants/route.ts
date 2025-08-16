import { NextRequest, NextResponse } from 'next/server';
import { RestaurantService } from '@/services/RestaurantService';

const restaurantService = new RestaurantService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const cuisine = searchParams.get('cuisine');
    const minRating = searchParams.get('minRating');
    const maxRating = searchParams.get('maxRating');

    let restaurants;

    if (search) {
      restaurants = await restaurantService.searchRestaurants(search);
    } else if (cuisine) {
      restaurants = await restaurantService.getRestaurantsByCuisine(cuisine);
    } else if (minRating && maxRating) {
      restaurants = await restaurantService.getRestaurantsByRating(
        parseFloat(minRating),
        parseFloat(maxRating)
      );
    } else {
      restaurants = await restaurantService.getAllRestaurants();
    }

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}