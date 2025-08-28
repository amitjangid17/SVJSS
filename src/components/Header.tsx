import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="px-3 py-6 sm:px-4 sm:py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
            <h1 className="text-2xl sm:text-4xl font-bold">PyroWorld</h1>
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
          </div>
          <p className="text-base sm:text-xl mb-4 sm:mb-6 text-purple-200 px-4">
            Premium Fireworks for Every Celebration
          </p>
        </div>
      </div>
      
      <div className="bg-yellow-400 text-black py-2 sm:py-3">
        <div className="px-3 sm:px-4">
          <p className="text-center font-medium text-xs sm:text-sm">
            🎆 Special Offer: Free shipping on orders over $100! 🎆
          </p>
        </div>
      </div>
    </header>
  );
}