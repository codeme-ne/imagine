'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface GalleryFiltersProps {
  filters: {
    styles: string[];
    industries: string[];
    useCases: string[];
  };
  currentFilters: {
    style: string | null;
    industry: string | null;
    useCase: string | null;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function GalleryFilters({
  filters,
  currentFilters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}: GalleryFiltersProps) {
  return (
    <div className="mb-8 space-y-6">
      {/* Style Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Style</h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by style">
          {filters.styles.map((style) => (
            <Button
              key={style}
              type="button"
              onClick={() => 
                onFilterChange('style', currentFilters.style === style ? '' : style)
              }
              variant={currentFilters.style === style ? 'orange' : 'outline'}
              size="sm"
              className={cn(
                'capitalize',
                currentFilters.style === style ? 'shadow-sm' : ''
              )}
              aria-pressed={currentFilters.style === style}
              aria-label={`Filter by ${style} style`}
            >
              {style}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Industry Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Industry</h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by industry">
          {filters.industries.map((industry) => (
            <Button
              key={industry}
              type="button"
              onClick={() => 
                onFilterChange('industry', currentFilters.industry === industry ? '' : industry)
              }
              variant={currentFilters.industry === industry ? 'orange' : 'outline'}
              size="sm"
              className={cn(
                'capitalize',
                currentFilters.industry === industry ? 'shadow-sm' : ''
              )}
              aria-pressed={currentFilters.industry === industry}
              aria-label={`Filter by ${industry} industry`}
            >
              {industry.replace('-', ' ')}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Use Case Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Use Case</h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by use case">
          {filters.useCases.map((useCase) => (
            <Button
              key={useCase}
              type="button"
              onClick={() => 
                onFilterChange('useCase', currentFilters.useCase === useCase ? '' : useCase)
              }
              variant={currentFilters.useCase === useCase ? 'orange' : 'outline'}
              size="sm"
              className={cn(
                'capitalize',
                currentFilters.useCase === useCase ? 'shadow-sm' : ''
              )}
              aria-pressed={currentFilters.useCase === useCase}
              aria-label={`Filter by ${useCase} use case`}
            >
              {useCase}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}