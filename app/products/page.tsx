"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { client } from "@/sanity.cli";
import imageUrlBuilder from "@sanity/image-url";
import { getAllProductsQuery } from "@/lib/queries";
import { formatDimensions } from "@/lib/formatDimensions";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedPaintingStyles, setSelectedPaintingStyles] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortOption, setSortOption] = useState("newest");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12); // Number of products per page

  const builder = imageUrlBuilder(client);

  function urlFor(source) {
    return builder.image(source);
  }

  // Mobile filter state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Predefined painting styles
  const paintingStyles = ["Full Paint", "Half Paint"];

  // Sort options
  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
  ];

  // Fetch products, categories, and materials on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await client.fetch(`*[_type == "category"] {
          _id,
          title
        }`);
        setCategories(categoriesData);

        // Fetch materials
        const materialsData = await client.fetch(`*[_type == "Material"] {
          _id,
          title
        }`);
        setMaterials(materialsData);

        // Fetch products with referenced data
        const productsData = await client.fetch(getAllProductsQuery);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle handlers for filters
  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const toggleMaterial = (materialId) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );
    setCurrentPage(1);
  };

  const togglePaintingStyle = (style) => {
    setSelectedPaintingStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setSelectedPaintingStyles([]);
    setPriceRange([0, 50000]);
    setSortOption("newest");
    setCurrentPage(1);
  };

  // Handle body scroll when mobile filter is open
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFiltersOpen]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (products.length === 0) return [];

    let result = products.filter((product) => {
      // Search filter
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        (product.category && selectedCategories.includes(product.category._id));

      // Material filter
      const matchesMaterial =
        selectedMaterials.length === 0 ||
        (product.material && selectedMaterials.includes(product.material._id));

      // Painting style filter
      const matchesPaintingStyle =
        selectedPaintingStyles.length === 0 ||
        selectedPaintingStyles.includes(product.paintingStyle);

      // Price filter
      const productPrice = parseFloat(product.price);
      const matchesPrice =
        productPrice >= priceRange[0] && productPrice <= priceRange[1];

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMaterial &&
        matchesPaintingStyle &&
        matchesPrice
      );
    });

    // Sorting logic
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => {
          const priceA = parseFloat(a.actual_price || a.price);
          const priceB = parseFloat(b.actual_price || b.price);
          return priceA - priceB;
        });
        break;
      case "price-high":
        result.sort((a, b) => {
          const priceA = parseFloat(a.actual_price || a.price);
          const priceB = parseFloat(b.actual_price || b.price);
          return priceB - priceA;
        });
        break;
      case "newest":
        // Sort by createdAt in descending order (newest first)
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "featured":
        result = result.filter((item) => item.featured === true);
        break;
    }

    return result;
  }, [
    products,
    search,
    selectedCategories,
    selectedMaterials,
    selectedPaintingStyles,
    priceRange,
    sortOption,
  ]);

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <p className="text-lg text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Sacred Artisan Collection
        </h1>
        <p className="text-lg sm:text-xl text-gray-600">
          Discover handcrafted spiritual artifacts
        </p>
      </div>

      {/* Search bar - always visible */}
      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset to first page when search changes
            }}
          />
        </div>
      </div>

      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <svg
            className="mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Filters
        </button>
      </div>

      {/* Mobile filters drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-full bg-white z-50 transform ${
          mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <div className="h-full overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <button
              type="button"
              className="w-10 h-10 p-2 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile filters content */}
          <div className="space-y-6">
            {/* Categories filter */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category._id} className="flex items-center">
                    <input
                      id={`mobile-category-${category._id}`}
                      type="checkbox"
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => toggleCategory(category._id)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`mobile-category-${category._id}`}
                      className="ml-3 text-sm text-gray-700"
                    >
                      {category.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Materials filter */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-900 mb-3">Materials</h3>
              <div className="space-y-2">
                {materials.map((material) => (
                  <div key={material._id} className="flex items-center">
                    <input
                      id={`mobile-material-${material._id}`}
                      type="checkbox"
                      checked={selectedMaterials.includes(material._id)}
                      onChange={() => toggleMaterial(material._id)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`mobile-material-${material._id}`}
                      className="ml-3 text-sm text-gray-700"
                    >
                      {material.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Painting style filter */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-900 mb-3">Painting Style</h3>
              <div className="space-y-2">
                {paintingStyles.map((style) => (
                  <div key={style} className="flex items-center">
                    <input
                      id={`mobile-painting-${style}`}
                      type="checkbox"
                      checked={selectedPaintingStyles.includes(style)}
                      onChange={() => togglePaintingStyle(style)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`mobile-painting-${style}`}
                      className="ml-3 text-sm text-gray-700"
                    >
                      {style}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price range filter */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value, 10)])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2 mt-8">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFiltersOpen(false);
                }}
                className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Reset all filters
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2 px-4 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar - Desktop */}
        <div className="hidden lg:block w-72 space-y-6">
          {/* Categories filter */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category._id} className="flex items-center">
                  <input
                    id={`category-${category._id}`}
                    type="checkbox"
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => toggleCategory(category._id)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`category-${category._id}`}
                    className="ml-3 text-sm text-gray-700"
                  >
                    {category.title}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Materials filter */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Materials</h3>
            <div className="space-y-2">
              {materials.map((material) => (
                <div key={material._id} className="flex items-center">
                  <input
                    id={`material-${material._id}`}
                    type="checkbox"
                    checked={selectedMaterials.includes(material._id)}
                    onChange={() => toggleMaterial(material._id)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`material-${material._id}`}
                    className="ml-3 text-sm text-gray-700"
                  >
                    {material.title}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Painting style filter */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Painting Style</h3>
            <div className="space-y-2">
              {paintingStyles.map((style) => (
                <div key={style} className="flex items-center">
                  <input
                    id={`painting-${style}`}
                    type="checkbox"
                    checked={selectedPaintingStyles.includes(style)}
                    onChange={() => togglePaintingStyle(style)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`painting-${style}`}
                    className="ml-3 text-sm text-gray-700"
                  >
                    {style}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price range filter */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value, 10)])
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between">
                <button
                  onClick={() => setPriceRange([0, 50000])}
                  className="text-xs text-yellow-600 hover:text-yellow-800"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="w-full mt-4 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Reset all filters
          </button>
        </div>

        {/* Products grid */}
        <div className="flex-1">
          {/* Results count and sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-medium">
                {indexOfFirstProduct + 1}-
                {Math.min(indexOfLastProduct, filteredProducts.length)}
              </span>{" "}
              of <span className="font-medium">{filteredProducts.length}</span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>
            <div className="relative w-full sm:w-48">
              <label htmlFor="sort" className="sr-only">
                Sort
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products */}
          {currentProducts.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No products found
              </h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filter criteria
              </p>
              <div className="mt-6">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {currentProducts.map((product) => {
                  const dimensions = product?.dimensions;
                  const unit = product?.dimensions?.unit?.symbol || "in";
                  return (
                    <div
                      key={product._id}
                      className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden flex flex-col h-full"
                    >
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100">
                        <div className="relative h-60 w-full">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={urlFor(product.images[0]).url()}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-200">
                              <span>No image available</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex-grow">
                          <Link href={`/product/${product.slug.current}`}>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {product.name}
                            </h3>
                          </Link>

                          <Link
                            href={`/category/${product.category?.slug.current}`}
                          >
                            <p className="mt-1 text-sm text-gray-500">
                              {product.category?.title}
                            </p>
                          </Link>

                          {/* Add dimensions display */}
                          {dimensions && (
                            <p className="text-sm text-gray-700">
                              Dimensions:{" "}
                              <span className="font-medium">
                                {[
                                  dimensions.height?.value &&
                                    `H: ${dimensions.height.value}${dimensions.height?.unit?.symbol || '"'}`,
                                  dimensions.width?.value &&
                                    `W: ${dimensions.width.value}${dimensions.width?.unit?.symbol || '"'}`,
                                  dimensions.length?.value &&
                                    `L: ${dimensions.length.value}${dimensions.length?.unit?.symbol || '"'}`,
                                ]
                                  .filter(Boolean) // Remove any falsy values
                                  .join(" × ")}
                              </span>
                            </p>
                          )}
                        </div>

                        <div className="mt-4 flex flex-col gap-2">
                          <p className="text-lg font-bold text-gray-900">
                            ₹{product.price}
                          </p>
                          <div className="flex space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {product.paintingStyle}
                            </span>
                            {product.material && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {product.material.title}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === number
                              ? "bg-yellow-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          }`}
                        >
                          {number}
                        </button>
                      )
                    )}

                    <button
                      onClick={() =>
                        paginate(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
