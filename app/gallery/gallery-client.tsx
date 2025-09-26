'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GalleryItem from '@/components/gallery/gallery-item';
import GalleryFilters from '@/components/gallery/gallery-filters';

interface GalleryItem {
  id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
  style: string;
  industry: string;
  useCase: string;
  prompt: string;
  dateCreated: string;
  likes: number;
  views: number;
}

interface GalleryData {
  items: GalleryItem[];
  filters: {
    styles: string[];
    industries: string[];
    useCases: string[];
  };
}

interface GalleryClientProps {
  galleryData: GalleryData;
  initialFilters: {
    style: string;
    industry: string;
    useCase: string;
  };
}

export default function GalleryClient({ galleryData, initialFilters }: GalleryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current filters from URL or use initial filters
  const currentStyle = searchParams.get('style') || initialFilters.style;
  const currentIndustry = searchParams.get('industry') || initialFilters.industry;
  const currentUseCase = searchParams.get('useCase') || initialFilters.useCase;
  
  // Filter the gallery items based on current filters
  const filteredItems = useMemo(() => {
    return galleryData.items.filter(item => {
      if (currentStyle && item.style !== currentStyle) return false;
      if (currentIndustry && item.industry !== currentIndustry) return false;
      if (currentUseCase && item.useCase !== currentUseCase) return false;
      return true;
    });
  }, [galleryData.items, currentStyle, currentIndustry, currentUseCase]);
  
  // Update URL when filters change
  const updateFilter = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(filterType, value);
    } else {
      params.delete(filterType);
    }
    
    router.push(`/gallery?${params.toString()}`);
  };
  
  const clearFilters = () => {
    router.push('/gallery');
  };
  
  const hasActiveFilters = currentStyle || currentIndustry || currentUseCase;
  
  return (
    <div>
      {/* Filters Section */}
      <GalleryFilters
        filters={galleryData.filters}
        currentFilters={{
          style: currentStyle,
          industry: currentIndustry,
          useCase: currentUseCase,
        }}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        hasActiveFilters={!!hasActiveFilters}
      />
      
      {/* Results count and status */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
          Showing {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
          {hasActiveFilters && ' (filtered)'}
        </p>
      </div>
      
      {/* Gallery Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <GalleryItem key={item.id} item={item} priority={index < 3} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No results found with the current filters.
          </p>
          <button
            onClick={clearFilters}
            className="text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}