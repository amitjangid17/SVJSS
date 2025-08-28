import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

import { Badge } from './ui/badge';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

export interface FilterState {
  searchTerm: string;
  selectedCategories: string[];
  sortBy: 'name' | 'price-low' | 'price-high' | 'pieces';
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories: string[];
  totalProductsCount: number;
  filteredProductsCount: number;
}

export function FilterBar({
  filters,
  onFiltersChange,
  categories,
  totalProductsCount,
  filteredProductsCount
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter(c => c !== category)
      : [...filters.selectedCategories, category];
    onFiltersChange({ ...filters, selectedCategories: newCategories });
  };



  const handleSortChange = (sort: string) => {
    onFiltersChange({ ...filters, sortBy: sort as FilterState['sortBy'] });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchTerm: '',
      selectedCategories: [],
      sortBy: 'name'
    });
  };

  const hasActiveFilters = 
    filters.searchTerm ||
    filters.selectedCategories.length > 0 ||
    filters.sortBy !== 'name';



  return (
    <Card className="mb-4 sm:mb-8">
      <CardContent className="p-3 sm:p-6">
        {/* Search and Sort Row */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search fireworks..."
              value={filters.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="flex-1 h-11">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="pieces">Pieces per Box</SelectItem>
              </SelectContent>
            </Select>
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 h-11 px-4">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      {filters.selectedCategories.length + (filters.searchTerm ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 sm:mt-4">
                <div className="p-3 sm:p-4 bg-slate-50 rounded-lg">
                  {/* Categories */}
                  <div>
                    <Label className="font-medium mb-2 sm:mb-3 block text-sm">Categories</Label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={filters.selectedCategories.includes(category) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCategoryToggle(category)}
                          className="text-xs h-8 min-h-8"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Results Summary and Clear Filters */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Showing {filteredProductsCount} of {totalProductsCount} products
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground h-8"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="text-xs sm:text-sm">Clear all</span>
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {filters.searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                Search: "{filters.searchTerm.slice(0, 10)}{filters.searchTerm.length > 10 ? '...' : ''}"
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => handleSearchChange('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.selectedCategories.map((category) => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1 text-xs">
                {category}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => handleCategoryToggle(category)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

          </div>
        )}
      </CardContent>
    </Card>
  );
}