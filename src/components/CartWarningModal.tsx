'use client';

import { Restaurant } from '@/types';

interface CartWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentRestaurant: Restaurant | null;
  newRestaurant: Restaurant | null;
}

export default function CartWarningModal({
  isOpen,
  onClose,
  onConfirm,
  currentRestaurant,
  newRestaurant
}: CartWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Clear Current Cart?
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            You currently have items from <strong>{currentRestaurant?.name}</strong> in your cart.
          </p>
          <p className="text-gray-600 mb-3">
            Adding an item from <strong>{newRestaurant?.name}</strong> will clear your current cart.
          </p>
          <p className="text-gray-800 font-medium">
            Do you want to continue?
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Keep Current Cart
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear & Add Item
          </button>
        </div>
      </div>
    </div>
  );
}