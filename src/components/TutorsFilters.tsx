import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MultiSelect, type OptionType } from '@/components/ui/multi-select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export interface FilterValues {
  searchQuery: string;
  selectedSubjects: string[];
  priceRange: [number, number];
  selectedCity: string;
}

interface TutorsFiltersProps {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
  availableSubjects: OptionType[];
  availableCities: OptionType[];
  maxPrice: number;
}

export function TutorsFilters({
  filters,
  onFiltersChange,
  availableSubjects,
  availableCities,
  maxPrice,
}: TutorsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchQuery: e.target.value,
    });
  };

  const handleSubjectsChange = (selectedSubjects: string[]) => {
    onFiltersChange({
      ...filters,
      selectedSubjects,
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      selectedSubjects: [],
      priceRange: [0, maxPrice],
      selectedCity: '',
    });
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.selectedSubjects.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== maxPrice ||
    filters.selectedCity !== '';

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-sm"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
          >
            {isExpanded ? 'Hide' : 'Show'}
          </Button>
        </div>
      </div>

      {/* Filters Content */}
      <div className={isExpanded ? 'block' : 'hidden lg:block'}>
        {/* Row 1: Search, Subjects, Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search">Search tutors</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                type="text"
                placeholder="Search by name..."
                value={filters.searchQuery}
                onChange={handleSearchChange}
                className="pl-9"
              />
            </div>
          </div>

          {/* Subjects Multi-Select */}
          <div className="space-y-2">
            <Label>Subjects</Label>
            <MultiSelect
              options={availableSubjects}
              selected={filters.selectedSubjects}
              onChange={handleSubjectsChange}
              placeholder="Select subjects..."
              emptyText="No subjects found"
            />
          </div>

          {/* City Select */}
          <div className="space-y-2">
            <Label>Location</Label>
            <MultiSelect
              options={availableCities}
              selected={filters.selectedCity ? [filters.selectedCity] : []}
              onChange={(selected) =>
                onFiltersChange({
                  ...filters,
                  selectedCity: selected[0] || '',
                })
              }
              placeholder="All locations"
              emptyText="No cities found"
            />
          </div>
        </div>

        {/* Row 2: Price Range - Full Width */}
        <div className="space-y-2">
          <Label>
            Price range: {filters.priceRange[0].toLocaleString()} -{' '}
            {filters.priceRange[1].toLocaleString()} sum/hour
          </Label>
          <div className="pt-2">
            <Slider
              min={0}
              max={maxPrice}
              step={5000}
              value={filters.priceRange}
              onValueChange={handlePriceRangeChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
