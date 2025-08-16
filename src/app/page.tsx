'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockRestaurants, mockMenuItems } from '@/data/mockData';
import { Restaurant } from '@/types';

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setRestaurants(mockRestaurants);
      return;
    }

    const filtered = mockRestaurants.filter((restaurant) => {
      const searchTerm = query.toLowerCase();
      
      // Search by restaurant name
      if (restaurant.name.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // Search by cuisine type
      if (restaurant.cuisine.toLowerCase().includes(searchTerm)) {
        return true;
      }
      
      // Search by menu items
      const restaurantMenu = mockMenuItems[restaurant.id] || [];
      return restaurantMenu.some((item) =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
      );
    });
    
    setRestaurants(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Restaurants Near You
          </h1>
          <p className="text-gray-600 mb-6">
            Discover great food from local restaurants
          </p>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search restaurants, cuisine, or menu items..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              data-testid="search-input"
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
              <div data-testid="restaurant-card" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
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
