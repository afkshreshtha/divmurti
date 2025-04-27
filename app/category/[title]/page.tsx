"use client";

import { client } from "@/sanity.cli";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";

const CategoryDetailPage = () => {
  const params = useParams();
  const slug = params.title;

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [materials, setMaterials] = useState([]);
  const [paintingStyles, setPaintingStyles] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedPaintingStyles, setSelectedPaintingStyles] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

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
  }, [searchQuery, selectedMaterials, selectedPaintingStyles, sortBy, products]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleMaterial = (slugCurrent) => {
    setSelectedMaterials((prev) =>
      prev.includes(slugCurrent)
        ? prev.filter((id) => id !== slugCurrent)
        : [...prev, slugCurrent]
    );
  };

  const togglePaintingStyle = (style) => {
    setSelectedPaintingStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const resetFilters = () => {
    setSelectedMaterials([]);
    setSelectedPaintingStyles([]);
    setSortBy("featured");
    setSearchQuery("");
    setCurrentPage(1);
  };

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
                <Link href="/" className="hover:text-primary transition flex items-center">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Home
                </Link>
                <span className="mx-2">/</span>
                <Link href="/categories" className="hover:text-primary transition">
                  Categories
                </Link>
                <span className="mx-2">/</span>
                <span className="text-primary font-medium">{category.title}</span>
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
              onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Mobile Filters */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden">
            <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl overflow-y-auto transform transition-transform duration-300 ease-in-out">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button 
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Sort Options */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Sort By</h3>
                    <div className="space-y-2">
                      {[
                        { value: "featured", label: "Featured" },
                        { value: "price-low", label: "Price: Low to High" },
                        { value: "price-high", label: "Price: High to Low" },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`mobile-sort-${option.value}`}
                            type="radio"
                            checked={sortBy === option.value}
                            onChange={() => setSortBy(option.value)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                          />
                          <label
                            htmlFor={`mobile-sort-${option.value}`}
                            className="ml-3 text-gray-700"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Material Filter */}
                  {materials.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Material</h3>
                      <div className="space-y-2">
                        {materials.map((material) => (
                          <div key={material.slug.current} className="flex items-center">
                            <input
                              id={`mobile-material-${material.slug.current}`}
                              type="checkbox"
                              checked={selectedMaterials.includes(material.slug.current)}
                              onChange={() => toggleMaterial(material.slug.current)}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`mobile-material-${material.slug.current}`}
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
                    <div>
                      <h3 className="text-lg font-medium mb-3">Painting Style</h3>
                      <div className="space-y-2">
                        {paintingStyles.map((style) => (
                          <div key={style} className="flex items-center">
                            <input
                              id={`mobile-style-${style}`}
                              type="checkbox"
                              checked={selectedPaintingStyles.includes(style)}
                              onChange={() => togglePaintingStyle(style)}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`mobile-style-${style}`}
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

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={resetFilters}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Filters</h2>

              {/* Sort Options */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
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
                      <div key={material.slug.current} className="flex items-center">
                        <input
                          id={`material-${material.slug.current}`}
                          type="checkbox"
                          checked={selectedMaterials.includes(material.slug.current)}
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

              {(selectedMaterials.length > 0 || selectedPaintingStyles.length > 0 || sortBy !== "featured") && (
                <button
                  onClick={resetFilters}
                  className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-grow">
            {/* Active Filters */}
            {(selectedMaterials.length > 0 || selectedPaintingStyles.length > 0) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedMaterials.map((slug) => {
                  const material = materials.find((m) => m.slug.current === slug);
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
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
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
                    // Format dimensions
                    const formatDimension = (dim) => {
                      if (!dim?.value) return null;
                      return `${dim.value}${dim?.unit?.symbol || '"'}`;
                    };

                    const height = formatDimension(product.dimensions?.height);
                    const width = formatDimension(product.dimensions?.width);
                    const length = formatDimension(product.dimensions?.length);
                    const dimensions = [height, width, length].filter(Boolean).join(" × ");

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
                              <span className="absolute top-3 right-3 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
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
                              <p className="text-sm text-gray-700">
                              Dimensions:{" "}
                              <span className="font-medium">
                                {[
                                  product?.dimensions?.height?.value &&
                                    `H: ${product?.dimensions.height.value}${product.dimensions.height?.unit?.symbol || '"'}`,
                                  product.dimensions?.width?.value &&
                                    `W: ${product.dimensions?.width?.value}${product.dimensions.width?.unit?.symbol || '"'}`,
                                  product.dimensions?.length?.value &&
                                    `L: ${product.dimensions?.length.value}${product.dimensions.length?.unit?.symbol || '"'}`,
                                ]
                                  .filter(Boolean) // Remove any falsy values
                                  .join(" × ")}
                              </span>
                            </p>
                            </div>

                            <div className="mt-auto">
                              <div className="flex items-center justify-between">
                                <p className="text-lg font-bold text-gray-900">
                                  {product.price}
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

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                            className={`w-10 h-10 flex items-center justify-center rounded-lg border ${currentPage === pageNum ? 'bg-primary text-white border-primary' : 'border-gray-200 hover:bg-gray-50'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="px-2">...</span>
                      )}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <button
                          onClick={() => paginate(totalPages)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg border ${currentPage === totalPages ? 'bg-primary text-white border-primary' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                          {totalPages}
                        </button>
                      )}

                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
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