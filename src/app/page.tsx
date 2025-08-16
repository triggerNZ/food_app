'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockRestaurants } from '@/data/mockData';
import { Restaurant } from '@/types';

export default function Home() {
  const [restaurants] = useState<Restaurant[]>(mockRestaurants);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Restaurants Near You
          </h1>
          <p className="text-gray-600">
            Discover great food from local restaurants
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-400">
                    {restaurant.name} Image
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {restaurant.cuisine}
                  </p>
                  <p className="text-gray-500 text-sm mb-3">
                    {restaurant.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-700 ml-1">
                        {restaurant.rating}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {restaurant.deliveryTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
