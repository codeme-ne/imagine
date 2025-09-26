import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import GalleryClient from './gallery-client';

export const metadata: Metadata = {
  title: 'Gallery - URL → Image',
  description: 'Explore stunning before/after transformations created with AI-powered image generation.',
};

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

async function getGalleryData(): Promise<GalleryData> {
  const filePath = path.join(process.cwd(), 'data', 'gallery.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const galleryData = await getGalleryData();
  const params = await searchParams;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Gallery
        </h1>
        <p className="text-muted-foreground text-lg">
          Explore stunning website transformations created with our AI-powered styles
        </p>
      </div>
      
      <GalleryClient 
        galleryData={galleryData} 
        initialFilters={{
          style: params.style as string || '',
          industry: params.industry as string || '',
          useCase: params.useCase as string || '',
        }}
      />
    </div>
  );
}