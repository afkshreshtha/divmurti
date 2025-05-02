"use client";

import { client } from "@/sanity.cli";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";

const CategoryDetailPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const slug = params.title;

  // Initialize state from URL
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states initialized from URL
  const [materials, setMaterials] = useState([]);
  const [paintingStyles, setPaintingStyles] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState(
    searchParams.get("materials")?.split(",") || []
  );
  const [selectedPaintingStyles, setSelectedPaintingStyles] = useState(
    searchParams.get("styles")?.split(",") || []
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get("minPrice")) || 0,
    parseInt(searchParams.get("maxPrice")) || 50000,
  ]);

  const productsPerPage = 12;

  const updateURL = useCallback(
    (newParams) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update all parameters
      if (newParams.search !== undefined) {
        if (newParams.search) {
          params.set("search", newParams.search);
        } else {
          params.delete("search");
        }
      }

      if (newParams.materials !== undefined) {
        if (newParams.materials.length > 0) {
          params.set("materials", newParams.materials.join(","));
        } else {
          params.delete("materials");
        }
      }

      if (newParams.styles !== undefined) {
        if (newParams.styles.length > 0) {
          params.set("styles", newParams.styles.join(","));
        } else {
          params.delete("styles");
        }
      }

      if (newParams.sort !== undefined) {
        if (newParams.sort !== "featured") {
          params.set("sort", newParams.sort);
        } else {
          params.delete("sort");
        }
      }

      if (newParams.page !== undefined) {
        if (newParams.page > 1) {
          params.set("page", newParams.page);
        } else {
          params.delete("page");
        }
      }

      if (newParams.minPrice !== undefined) {
        if (newParams.minPrice > 0) {
          params.set("minPrice", newParams.minPrice);
        } else {
          params.delete("minPrice");
        }
      }

      if (newParams.maxPrice !== undefined) {
        if (newParams.maxPrice < 50000) {
          params.set("maxPrice", newParams.maxPrice);
        } else {
          params.delete("maxPrice");
        }
      }

      // Push new URL without page reload
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category details
        const [categoryData, productsData] = await Promise.all([
          client.fetch(
            `
            *[_type == "category" && (slug.current == $slug || slug == $slug)][0] {
              title,
              "images": images[].asset->url,
              "mainImage": images[0].asset->url,
              description,
              slug
            }
          `,
            { slug }
          ),

          client.fetch(
            `
            *[_type == "product" && references(*[_type == "category" && (slug.current == $slug || slug == $slug)]._id)] {
              _id,
              name,
              slug,
              price,
              actual_price,
              paintingStyle,
              "images": images[].asset->url,
              "mainImage": images[0].asset->url,
              featured,
              material->{title, slug},
              dimensions {
                length {
                  value,
                  unit->{title, symbol}
                },
                width {
                  value,
                  unit->{title, symbol}
                },
                height {
                  value,
                  unit->{title, symbol}
                }
              }
            }
          `,
            { slug }
          ),
        ]);

        if (!categoryData) throw new Error("Category not found");

        setCategory(categoryData);
        setProducts(productsData);

        // Extract unique materials and painting styles
        const uniqueMaterials = productsData.reduce((acc, product) => {
          if (
            product.material &&
            !acc.some((m) => m.slug.current === product.material.slug.current)
          ) {
            acc.push(product.material);
          }
          return acc;
        }, []);

        const uniquePaintingStyles = [
          ...new Set(
            productsData
              .filter((p) => p.paintingStyle)
              .map((p) => p.paintingStyle)
          ),
        ];

        setMaterials(uniqueMaterials);
        setPaintingStyles(uniquePaintingStyles);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Material filter
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(
        (p) => p.material && selectedMaterials.includes(p.material.slug.current)
      );
    }

    // Painting style filter
    if (selectedPaintingStyles.length > 0) {
      filtered = filtered.filter(
        (p) =>
          p.paintingStyle && selectedPaintingStyles.includes(p.paintingStyle)
      );
    }

    // Price range filter
    filtered = filtered.filter((p) => {
      const price = parseFloat(p.price || p.actual_price || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) =>
            parseFloat(a.price || a.actual_price || 0) -
            parseFloat(b.price || b.actual_price || 0)
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) =>
            parseFloat(b.price || b.actual_price || 0) -
            parseFloat(a.price || a.actual_price || 0)
        );
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (b.featured === true) - (a.featured === true));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    searchQuery,
    selectedMaterials,
    selectedPaintingStyles,
    sortBy,
    products,
    priceRange,
  ]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const toggleMaterial = (slugCurrent) => {
    const newMaterials = selectedMaterials.includes(slugCurrent)
      ? selectedMaterials.filter((id) => id !== slugCurrent)
      : [...selectedMaterials, slugCurrent];

    setSelectedMaterials(newMaterials);
    updateURL({ materials: newMaterials, page: 1 });
  };

  const togglePaintingStyle = (style) => {
    const newStyles = selectedPaintingStyles.includes(style)
      ? selectedPaintingStyles.filter((s) => s !== style)
      : [...selectedPaintingStyles, style];

    setSelectedPaintingStyles(newStyles);
    updateURL({ styles: newStyles, page: 1 });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    updateURL({ sort: value, page: 1 });
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    updateURL({ search: value, page: 1 });
  };

  const handlePriceChange = (min, max) => {
    setPriceRange([min, max]);
    updateURL({ minPrice: min, maxPrice: max, page: 1 });
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    updateURL({ page: pageNumber });
  };

  const resetFilters = () => {
    setSelectedMaterials([]);
    setSelectedPaintingStyles([]);
    setSortBy("featured");
    setSearchQuery("");
    setPriceRange([0, 50000]);
    setCurrentPage(1);
    updateURL({
      materials: [],
      styles: [],
      sort: "featured",
      search: "",
      minPrice: 0,
      maxPrice: 50000,
      page: 1,
    });
  };

  useEffect(() => {
    // This ensures the URL is in sync when the page loads with filters
    if (!isLoading) {
      updateURL({
        materials: selectedMaterials,
        styles: selectedPaintingStyles,
        sort: sortBy,
        search: searchQuery,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        page: currentPage,
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Skeleton loading */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <Skeleton className="h-8 w-32 mb-4" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full mb-2" />
            ))}
          </div>
          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <Skeleton className="w-full aspect-square" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <Link
          href="/categories"
          className="mt-4 inline-flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Link
                  href="/"
                  className="hover:text-primary transition flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Home
                </Link>
                <span className="mx-2">/</span>
                <Link
                  href="/categories"
                  className="hover:text-primary transition"
                >
                  Categories
                </Link>
                <span className="mx-2">/</span>
                <span className="text-primary font-medium">
                  {category.title}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {category.title}
              </h1>
              {category.description && (
                <p className="text-lg text-gray-600 mb-6">
                  {category.description}
                </p>
              )}
            </div>

            {category.mainImage && (
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={category.mainImage}
                  alt={category.title}
                  width={256}
                  height={256}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm md:hidden"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
            <div className="h-full w-full pb-24">
              {/* Header */}
              <div className="px-4 py-4 flex justify-between items-center border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-medium">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Filter Content */}
              <div className="px-4">
                {/* Sort Options */}
                <div className="py-5 border-b border-gray-200">
                  <h3 className="text-base font-medium mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                {/* Materials */}
                <div className="py-5 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-medium">Materials</h3>
                    {selectedMaterials.length > 0 && (
                      <button
                        onClick={() => setSelectedMaterials([])}
                        className="text-sm text-primary hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {materials.map((material) => (
                      <div
                        key={material.slug.current}
                        className="flex items-center"
                      >
                        <input
                          id={`mobile-material-${material.slug.current}`}
                          type="checkbox"
                          checked={selectedMaterials.includes(
                            material.slug.current
                          )}
                          onChange={() => toggleMaterial(material.slug.current)}
                          className="h-4 w-4 text-primary border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`mobile-material-${material.slug.current}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {material.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Painting Style */}
                <div className="py-5 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-medium">Painting Style</h3>
                    {selectedPaintingStyles.length > 0 && (
                      <button
                        onClick={() => setSelectedPaintingStyles([])}
                        className="text-sm text-primary hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {paintingStyles.map((style) => (
                      <div key={style} className="flex items-center">
                        <input
                          id={`mobile-style-${style}`}
                          type="checkbox"
                          checked={selectedPaintingStyles.includes(style)}
                          onChange={() => togglePaintingStyle(style)}
                          className="h-4 w-4 text-primary border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`mobile-style-${style}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {style}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="py-5 border-b border-gray-200">
                  <h3 className="text-base font-medium mb-4">Price Range</h3>
                  <div className="mb-2 flex justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange[0]}
                      onChange={(e) =>
                        handlePriceChange(
                          parseInt(e.target.value),
                          priceRange[1]
                        )
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        handlePriceChange(
                          priceRange[0],
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
                    />
                  </div>
                  <div className="mt-4 flex justify-between gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Min
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={(e) =>
                          handlePriceChange(
                            parseInt(e.target.value),
                            priceRange[1]
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Max
                      </label>
                      <input
                        type="number"
                        min={priceRange[0]}
                        max="50000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          handlePriceChange(
                            priceRange[0],
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Fixed at Bottom */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={resetFilters}
                    className="w-full py-3 bg-amber-500 text-white font-medium rounded-md hover:bg-amber-600 transition-colors"
                  >
                    Reset all filters
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                {(selectedMaterials.length > 0 ||
                  selectedPaintingStyles.length > 0 ||
                  sortBy !== "featured" ||
                  priceRange[0] !== 0 ||
                  priceRange[1] !== 50000) && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-primary hover:underline"
                  >
                    Reset all
                  </button>
                )}
              </div>

              {/* Sort Options */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">Price Range</h3>
                <div className="mb-2 flex justify-between text-sm text-gray-600">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={priceRange[0]}
                    onChange={(e) =>
                      handlePriceChange(parseInt(e.target.value), priceRange[1])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      handlePriceChange(priceRange[0], parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
                  />
                </div>
                <div className="mt-4 flex justify-between gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">
                      Min
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(e) =>
                        handlePriceChange(
                          parseInt(e.target.value),
                          priceRange[1]
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">
                      Max
                    </label>
                    <input
                      type="number"
                      min={priceRange[0]}
                      max="50000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        handlePriceChange(
                          priceRange[0],
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Material Filter */}
              {materials.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">Material</h3>
                    {selectedMaterials.length > 0 && (
                      <button
                        onClick={() => setSelectedMaterials([])}
                        className="text-sm text-primary hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {materials.map((material) => (
                      <div
                        key={material.slug.current}
                        className="flex items-center"
                      >
                        <input
                          id={`material-${material.slug.current}`}
                          type="checkbox"
                          checked={selectedMaterials.includes(
                            material.slug.current
                          )}
                          onChange={() => toggleMaterial(material.slug.current)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`material-${material.slug.current}`}
                          className="ml-3 text-gray-700"
                        >
                          {material.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Painting Style Filter */}
              {paintingStyles.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">Painting Style</h3>
                    {selectedPaintingStyles.length > 0 && (
                      <button
                        onClick={() => setSelectedPaintingStyles([])}
                        className="text-sm text-primary hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {paintingStyles.map((style) => (
                      <div key={style} className="flex items-center">
                        <input
                          id={`style-${style}`}
                          type="checkbox"
                          checked={selectedPaintingStyles.includes(style)}
                          onChange={() => togglePaintingStyle(style)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`style-${style}`}
                          className="ml-3 text-gray-700"
                        >
                          {style}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-grow">
            {/* Active Filters */}
            {(selectedMaterials.length > 0 ||
              selectedPaintingStyles.length > 0 ||
              priceRange[0] !== 0 ||
              priceRange[1] !== 50000) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedMaterials.map((slug) => {
                  const material = materials.find(
                    (m) => m.slug.current === slug
                  );
                  return material ? (
                    <span
                      key={slug}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {material.title}
                      <button
                        onClick={() => toggleMaterial(slug)}
                        className="ml-1.5 p-0.5 rounded-full hover:bg-gray-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
                {selectedPaintingStyles.map((style) => (
                  <span
                    key={style}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {style}
                    <button
                      onClick={() => togglePaintingStyle(style)}
                      className="ml-1.5 p-0.5 rounded-full hover:bg-gray-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {(priceRange[0] !== 0 || priceRange[1] !== 50000) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    ₹{priceRange[0].toLocaleString()} - ₹
                    {priceRange[1].toLocaleString()}
                    <button
                      onClick={() => handlePriceChange(0, 50000)}
                      className="ml-1.5 p-0.5 rounded-full hover:bg-gray-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {indexOfFirstProduct + 1}-
                {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </p>
            </div>

            {/* Products Grid */}
            {currentProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search term
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map((product) => {
                    const price = parseFloat(
                      product.price || product.actual_price || 0
                    );
                    const formattedPrice = new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(price);

                    return (
                      <Link
                        href={`/product/${product.slug?.current || product.slug}`}
                        key={product._id}
                        className="group"
                      >
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full flex flex-col hover:shadow-md transition-all border border-gray-100">
                          {/* Product Image */}
                          <div className="relative aspect-square overflow-hidden">
                            {product.mainImage ? (
                              <Image
                                src={product.mainImage}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400">No image</span>
                              </div>
                            )}
                            {product.featured && (
                              <span className="absolute top-3 right-3 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                Featured
                              </span>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="p-5 flex flex-col flex-grow">
                            <div className="flex-grow">
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-700 mb-2">
                                {[
                                  product?.dimensions?.height?.value &&
                                    `H: ${product?.dimensions.height.value}${product.dimensions.height?.unit?.symbol || '"'}`,
                                  product.dimensions?.width?.value &&
                                    `W: ${product.dimensions?.width?.value}${product.dimensions.width?.unit?.symbol || '"'}`,
                                  product.dimensions?.length?.value &&
                                    `L: ${product.dimensions?.length.value}${product.dimensions.length?.unit?.symbol || '"'}`,
                                ]
                                  .filter(Boolean)
                                  .join(" × ")}
                              </p>
                            </div>

                            <div className="mt-auto">
                              <div className="flex items-center justify-between">
                                <p className="text-lg font-bold text-gray-900">
                                  {formattedPrice}
                                </p>
                                <div className="flex gap-1">
                                  {product.paintingStyle && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      {product.paintingStyle}
                                    </span>
                                  )}
                                  {product.material && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                      {product.material.title}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {/* Pagination */}
                <div className="mt-8">
                  <p className="text-sm text-gray-600 mb-4">
                    Page {currentPage} of {totalPages}
                  </p>
                  </div>

                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="flex items-center gap-1">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              className={`w-10 h-10 flex items-center justify-center rounded-lg border ${currentPage === pageNum ? "bg-primary text-white border-primary" : "border-gray-200 hover:bg-gray-50"}`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="px-2">...</span>
                      )}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <button
                          onClick={() => paginate(totalPages)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg border ${currentPage === totalPages ? "bg-primary text-white border-primary" : "border-gray-200 hover:bg-gray-50"}`}
                        >
                          {totalPages}
                        </button>
                      )}

                      <button
                        onClick={() =>
                          paginate(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CategoryDetailPage;
