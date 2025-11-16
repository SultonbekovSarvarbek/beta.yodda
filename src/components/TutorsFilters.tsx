import { useState } from 'react';
import { X } from 'lucide-react';
import { MultiSelect, type OptionType } from '@/components/ui/multi-select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

export interface FilterValues {
  searchQuery: string;
  selectedSubjects: number[];
  selectedLanguages: number[];
  selectedGender: number | undefined;
  selectedRegion: number | undefined;
  selectedCity: number | undefined;
  priceRange: [number, number];
}

interface TutorsFiltersProps {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
  subjects: OptionType[];
  languages: OptionType[];
  regions: OptionType[];
  cities: OptionType[];
  maxPrice: number;
  isLoadingFilters?: boolean;
}

export function TutorsFilters({
  filters,
  onFiltersChange,
  subjects,
  languages,
  regions,
  cities,
  maxPrice,
  isLoadingFilters,
}: TutorsFiltersProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  // Convert number[] to string[] for MultiSelect compatibility
  const selectedSubjectStrings = filters.selectedSubjects.map(String);
  const selectedLanguageStrings = filters.selectedLanguages.map(String);

  // Filter cities based on selected region
  const filteredCities = filters.selectedRegion
    ? cities.filter((_city) => {
        // Assuming cities have region info in their metadata
        return true; // Will be properly filtered when we get city data from regions
      })
    : cities;

  const handleSubjectsChange = (selected: string[]) => {
    onFiltersChange({
      ...filters,
      selectedSubjects: selected.map(Number),
    });
  };

  const handleLanguagesChange = (selected: string[]) => {
    onFiltersChange({
      ...filters,
      selectedLanguages: selected.map(Number),
    });
  };

  const handleGenderChange = (value: string) => {
    onFiltersChange({
      ...filters,
      selectedGender: value === 'all' ? undefined : Number(value),
    });
  };

  const handleRegionChange = (value: string) => {
    onFiltersChange({
      ...filters,
      selectedRegion: value === 'all' ? undefined : Number(value),
      selectedCity: undefined, // Reset city when region changes
    });
  };

  const handleCityChange = (value: string) => {
    onFiltersChange({
      ...filters,
      selectedCity: value === 'all' ? undefined : Number(value),
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
      selectedLanguages: [],
      selectedGender: undefined,
      selectedRegion: undefined,
      selectedCity: undefined,
      priceRange: [50000, maxPrice],
    });
  };

  const hasActiveFilters =
    filters.selectedSubjects.length > 0 ||
    filters.selectedLanguages.length > 0 ||
    filters.selectedGender !== undefined ||
    filters.selectedRegion !== undefined ||
    filters.selectedCity !== undefined ||
    filters.priceRange[0] !== 50000 ||
    filters.priceRange[1] !== maxPrice;

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{t('filters.title')}</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-sm"
            >
              <X className="h-4 w-4 mr-1" />
              {t('filters.clearAll')}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
          >
            {isExpanded ? t('filters.hide') : t('filters.show')}
          </Button>
        </div>
      </div>

      {/* Filters Content */}
      <div className={isExpanded ? 'block' : 'hidden lg:block'}>
        {/* Row 1: Subjects, Languages */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 mb-4">
          {/* Subjects Multi-Select */}
          <div className="space-y-2">
            <Label>{t('filters.subjects')}</Label>
            <MultiSelect
              options={subjects}
              selected={selectedSubjectStrings}
              onChange={handleSubjectsChange}
              placeholder={t('filters.selectSubjects')}
              emptyText={t('filters.noSubjectsFound')}
            />
          </div>

          {/* Teaching Languages Multi-Select */}
          <div className="space-y-2">
            <Label>{t('filters.teachingLanguages')}</Label>
            <MultiSelect
              options={languages}
              selected={selectedLanguageStrings}
              onChange={handleLanguagesChange}
              placeholder={t('filters.selectLanguages')}
              emptyText={t('filters.noLanguagesFound')}
            />
          </div>
        </div>

        {/* Row 2: Region, City, Gender */}
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Region Select */}
          <div className="space-y-2">
            <Label>{t('filters.region')}</Label>
            <Select
              value={filters.selectedRegion?.toString() || 'all'}
              onValueChange={handleRegionChange}
              disabled={isLoadingFilters}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('filters.allRegions')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.allRegions')}</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City Select */}
          <div className="space-y-2">
            <Label>{t('filters.city')}</Label>
            <Select
              value={filters.selectedCity?.toString() || 'all'}
              onValueChange={handleCityChange}
              disabled={isLoadingFilters || !filters.selectedRegion}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('filters.allCities')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.allCities')}</SelectItem>
                {filteredCities.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gender Select */}
          <div className="space-y-2">
            <Label>{t('filters.gender')}</Label>
            <Select
              value={filters.selectedGender?.toString() || 'all'}
              onValueChange={handleGenderChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('filters.allGenders')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.allGenders')}</SelectItem>
                <SelectItem value="1">{t('common.male')}</SelectItem>
                <SelectItem value="2">{t('common.female')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 3: Price Range - Full Width */}
        <div className="space-y-2">
          <Label>
            {t('filters.priceRange')}: {filters.priceRange[0].toLocaleString()} -{' '}
            {filters.priceRange[1].toLocaleString()} {t('common.sumPerHour')}
          </Label>
          <div className="pt-2">
            <Slider
              min={50000}
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
