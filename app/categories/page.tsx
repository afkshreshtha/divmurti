"use client"

import { client } from '@/sanity.cli';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // Assuming you have a skeleton component

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await client.fetch(`*[_type == "category"] {
          slug,
          title,
          description,
          "image": image.asset->url,
          "imageDimensions": image.asset->metadata.dimensions
        }`);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Explore Our Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <Skeleton className="w-full aspect-square" />
              <div className="p-6 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Our Collections</h1>
        <p className="text-lg text-muted-foreground">
          Explore our carefully curated categories to find exactly what you're looking for
        </p>
      </div>
      
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const aspectRatio = category.imageDimensions 
              ? category.imageDimensions.aspectRatio 
              : 1;
            
            return (
              <Link 
                href={`/category/${category.slug?.current || category.slug}`} 
                key={category.slug?.current || category.slug}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col border border-gray-100">
                  <div className="relative w-full" style={{ paddingBottom: `${100 / aspectRatio}%` }}>
                    {category.image ? (
                      <Image 
                        src={category.image} 
                        alt={category.title} 
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        priority={false}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors">
                      {category.title}
                    </h2>
                    {category.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {category.description}
                      </p>
                    )}
                    <div className="mt-auto pt-2">
                      <span className="inline-flex items-center text-sm font-medium text-primary">
                        View collection
                        <svg 
                          className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;