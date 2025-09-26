'use client';

import { Button } from '@/components/ui/button';
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
            <button
              key={style}
              onClick={() => 
                onFilterChange('style', currentFilters.style === style ? '' : style)
              }
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all
                ${currentFilters.style === style
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
                }
              `}
              aria-pressed={currentFilters.style === style}
              aria-label={`Filter by ${style} style`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
      
      {/* Industry Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Industry</h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by industry">
          {filters.industries.map((industry) => (
            <button
              key={industry}
              onClick={() => 
                onFilterChange('industry', currentFilters.industry === industry ? '' : industry)
              }
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize
                ${currentFilters.industry === industry
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
                }
              `}
              aria-pressed={currentFilters.industry === industry}
              aria-label={`Filter by ${industry} industry`}
            >
              {industry.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
      
      {/* Use Case Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Use Case</h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by use case">
          {filters.useCases.map((useCase) => (
            <button
              key={useCase}
              onClick={() => 
                onFilterChange('useCase', currentFilters.useCase === useCase ? '' : useCase)
              }
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize
                ${currentFilters.useCase === useCase
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
                }
              `}
              aria-pressed={currentFilters.useCase === useCase}
              aria-label={`Filter by ${useCase} use case`}
            >
              {useCase}
            </button>
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