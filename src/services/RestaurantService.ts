import { RestaurantRepository, MenuItemRepository } from '@/repositories';
import { Restaurant, MenuItem } from '@/types';

export class RestaurantService {
  private restaurantRepo: RestaurantRepository;
  private menuItemRepo: MenuItemRepository;

  constructor() {
    this.restaurantRepo = new RestaurantRepository();
    this.menuItemRepo = new MenuItemRepository();
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    return this.restaurantRepo.findAll();
  }

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    return this.restaurantRepo.findById(id);
  }

  async getRestaurantMenu(restaurantId: string): Promise<MenuItem[]> {
    return this.menuItemRepo.findByRestaurantId(restaurantId);
  }

  async searchRestaurants(searchTerm: string): Promise<Restaurant[]> {
    return this.restaurantRepo.search(searchTerm);
  }

  async getRestaurantsByCuisine(cuisine: string): Promise<Restaurant[]> {
    return this.restaurantRepo.findByCuisine(cuisine);
  }

  async getRestaurantsByRating(minRating: number, maxRating: number): Promise<Restaurant[]> {
    return this.restaurantRepo.findByRatingRange(minRating, maxRating);
  }

  async searchMenuItems(searchTerm: string, restaurantId?: string): Promise<MenuItem[]> {
    if (restaurantId) {
      return this.menuItemRepo.searchByRestaurant(searchTerm, restaurantId);
    }
    return this.menuItemRepo.search(searchTerm);
  }

  async getMenuItemsByCategory(category: string, restaurantId?: string): Promise<MenuItem[]> {
    if (restaurantId) {
      return this.menuItemRepo.findByCategoryAndRestaurant(category, restaurantId);
    }
    return this.menuItemRepo.findByCategory(category);
  }

  async getMenuItemsByPriceRange(minPrice: number, maxPrice: number): Promise<MenuItem[]> {
    return this.menuItemRepo.findByPriceRange(minPrice, maxPrice);
  }

  async getCategories(restaurantId?: string): Promise<string[]> {
    if (restaurantId) {
      return this.menuItemRepo.getCategoriesByRestaurant(restaurantId);
    }
    return this.menuItemRepo.getCategories();
  }
}