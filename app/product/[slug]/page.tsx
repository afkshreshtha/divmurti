"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FaWhatsapp, FaArrowLeft, FaShare } from "react-icons/fa";
import { MdOutlineLocalShipping } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";
import Link from "next/link";
import { getProductBySlugQuery } from "@/lib/queries";
import { client } from "@/sanity.cli";
import { urlFor } from "@/sanity/lib/image";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component

const ProductDetail = ({ product }) => {
  const demoProduct = {
    _id: "1",
    name: "Abstract Mountain Landscape",
    price: 299,
    actual_price: 399,
    paintingStyle: "Impressionism",
    image: "/placeholder-product.jpg",
    category: { title: "Paintings", slug: "paintings" },
    material: { title: "Premium Canvas", slug: "canvas" },
    dimensions: {
      length: 60,
      width: 40,
      height: 2,
      unit: { title: "Centimeter", symbol: "cm" },
    },
    description:
      "A beautiful abstract representation of mountain landscapes at sunset. Hand-painted with high-quality acrylics on premium canvas. This piece brings a sense of peace and tranquility to any space. Each painting is signed by the artist and includes a certificate of authenticity.",
    artist: {
      name: "Sarah Johnson",
      bio: "Contemporary artist specializing in abstract landscapes",
    },
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
  };

  const displayProduct = product || demoProduct;

  // Fix: Handle different image formats between demo and Sanity
  const productImages =
    displayProduct.images ||
    (displayProduct.image ? [displayProduct.image] : []);

  const [selectedImage, setSelectedImage] = useState(0); // Store index instead of the image object
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const getImageUrl = (image) => {
    // Handle both string paths and Sanity image references
    if (typeof image === "string" && image.startsWith("/")) {
      return image; // Already a path, no need for urlFor
    }
    return urlFor(image).url();
  };

  const handleWhatsAppContact = () => {
    const productImageUrl =
      productImages.length > 0 ? getImageUrl(productImages[0]) : null;

    const message = `Hi, I'm interested in purchasing:

      *${displayProduct.name}*
      ${productImageUrl ? `🖼 Product Image: ${productImageUrl}\n` : ""}
      💰 Price: ₹${displayProduct.price}${
        displayProduct.actual_price
          ? ` (${Math.round(
              ((displayProduct.actual_price - displayProduct.price) /
                displayProduct.actual_price) *
                100
            )}% off)`
          : ""
      }
      📦 Quantity: ${quantity}
      ${
        displayProduct.dimensions
          ? `📐 Dimensions: ${displayProduct.dimensions.height?.value}${displayProduct.dimensions.height?.unit?.symbol || ""} × ${displayProduct.dimensions.width?.value}${displayProduct.dimensions.width?.unit?.symbol || ""} × ${displayProduct.dimensions.length?.value}${displayProduct.dimensions.length?.unit?.symbol || ""}\n`
          : ""
      }
      🪵 Material: ${displayProduct.material?.title || ""}

      Could you provide more details?`;

    const whatsappUrl = `https://wa.me/8273366089?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb Navigation - Modernized */}
        <nav className="flex items-center text-sm mb-8">
          <Link
            href="/"
            className="flex items-center text-gray-500 hover:text-primary transition"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Shop</span>
          </Link>
          <span className="mx-3 text-gray-300">/</span>
          <Link
            href={`/category/${
              displayProduct.category?.slug?.current ||
              (displayProduct.category?.slug &&
              typeof displayProduct.category.slug === "string"
                ? displayProduct.category.slug
                : "")
            }`}
            className="text-gray-500 hover:text-primary transition"
          >
            {displayProduct.category?.title || "All Products"}
          </Link>
          <span className="mx-3 text-gray-300">/</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">
            {displayProduct.name}
          </span>
        </nav>

        {/* Main Product Card - Modern Design */}
        <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {/* Product Gallery - Modernized */}
          <div className="lg:w-1/2 p-6">
            <div className="sticky top-4">
              {/* Main Image with Modern Shadow */}
              <div className="relative aspect-square w-full bg-gray-50 rounded-xl overflow-hidden mb-4 shadow-md">
                {productImages.length > 0 && (
                  <Image
                    src={getImageUrl(productImages[selectedImage])}
                    alt={displayProduct.name}
                    fill
                    className="object-contain w-full h-full"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
                {displayProduct.actual_price && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    {Math.round(
                      ((displayProduct.actual_price - displayProduct.price) /
                        displayProduct.actual_price) *
                        100
                    )}
                    % OFF
                  </div>
                )}
  
              </div>

              {/* Thumbnail Gallery - Modernized */}
              {productImages.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                        selectedImage === index
                          ? "ring-2 ring-primary ring-offset-2"
                          : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      <div className="relative w-16 h-16">
                        <Image
                          src={getImageUrl(image)}
                          alt={`${displayProduct.name} - ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details - Modernized */}
          <div className="lg:w-1/2 p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {displayProduct.name}
              </h1>
            </div>

            {/* Rating Badge - Modern */}
            {displayProduct.rating && (
              <div className="flex items-center mb-6">
                <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                  <svg
                    className="w-4 h-4 text-yellow-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">
                    {displayProduct.rating}
                  </span>
                  <span className="mx-1 text-gray-400">|</span>
                  <span className="text-sm text-gray-500">
                    {displayProduct.reviewCount} reviews
                  </span>
                </div>
              </div>
            )}

            {/* Price Section - Modern */}
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{displayProduct.price}
                </span>
                {displayProduct.actual_price && (
                  <span className="text-lg text-gray-500 line-through">
                    ₹{displayProduct.actual_price}
                  </span>
                )}
              </div>
              {displayProduct.actual_price && (
                <div className="mt-1 text-sm text-green-600 font-medium">
                  You save ₹{displayProduct.actual_price - displayProduct.price}{" "}
                  (
                  {Math.round(
                    ((displayProduct.actual_price - displayProduct.price) /
                      displayProduct.actual_price) *
                      100
                  )}
                  %)
                </div>
              )}
            </div>

            {/* Quantity Selector - Fixed and Modern */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg w-fit overflow-hidden bg-white">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className={`px-3 py-2 text-gray-600 hover:bg-gray-50 ${
                    quantity <= 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:text-primary"
                  }`}
                  disabled={quantity <= 1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <span className="px-4 py-2 border-x border-gray-200 font-medium w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className={`px-3 py-2 text-gray-600 hover:bg-gray-50 ${
                    quantity >= 10
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:text-primary"
                  }`}
                  disabled={quantity >= 10}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Product Specifications - Modern Grid */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayProduct.paintingStyle && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Style
                  </p>
                  <p className="font-medium">{displayProduct.paintingStyle}</p>
                </div>
              )}

              {displayProduct.material && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Material
                  </p>
                  <p className="font-medium">
                    {typeof displayProduct.material === "object" &&
                    displayProduct.material?.title
                      ? displayProduct.material.title
                      : displayProduct.material}
                  </p>
                </div>
              )}

              {displayProduct.dimensions && (
                <div className="bg-gray-50 p-3 rounded-lg col-span-1 sm:col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Dimensions
                  </p>
                  <p className="font-medium">
                    {displayProduct.dimensions.height?.value}
                    {displayProduct.dimensions.height?.unit?.symbol
                      ? `"${displayProduct.dimensions.height.unit.symbol}`
                      : '"'}{" "}
                    x {displayProduct.dimensions.width?.value}
                    {displayProduct.dimensions.width?.unit?.symbol || ""} x{" "}
                    {displayProduct.dimensions.length?.value}
                    {displayProduct.dimensions.length?.unit?.symbol || ""}
                  </p>
                </div>
              )}

              {displayProduct.artist && (
                <div className="bg-gray-50 p-3 rounded-lg col-span-1 sm:col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Artist
                  </p>
                  <p className="font-medium">{displayProduct.artist.name}</p>
                  {displayProduct.artist.bio && (
                    <p className="text-sm text-gray-600 mt-1">
                      {displayProduct.artist.bio}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Description - Modern */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {displayProduct.description}
              </p>
            </div>

            {/* Action Buttons - Modern */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleWhatsAppContact}
                className="flex-1 flex items-center justify-center bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200 gap-2 shadow-md hover:shadow-lg"
              >
                <FaWhatsapp className="text-xl" />
                Buy Now
              </button>
            </div>

            {/* Trust Badges - Modern */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MdOutlineLocalShipping className="text-xl text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Premium Shipping</p>
                    <p className="text-gray-600">Insured & tracked delivery</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full">
                  <RiSecurePaymentLine className="text-xl text-primary" />
                </div>
                <div>
                  <p className="font-medium">Secure Payments</p>
                  <p className="text-gray-600">100% protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section - Modern */}
        {/* <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">You May Also Like</h2>
            <Link href="/category/paintings" className="text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition hover:-translate-y-1"
              >
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={`/related-${item}.jpg`}
                    alt={`Related product ${item}`}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback if image not found
                      e.currentTarget.src = "/placeholder-product.jpg";
                    }}
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition">
                    <FaHeart className="text-gray-400 hover:text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                    Related Product {item}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-primary font-semibold">
                      ₹{499 + item * 100}
                    </p>
                    {item % 2 === 0 && (
                      <p className="text-xs text-gray-500 line-through">₹{599 + item * 100}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  const fetchProductBySlug = async (slug) => {
    if (!slug) return null;
    try {
      const query = getProductBySlugQuery(slug);
      return await client.fetch(query);
    } catch (error) {
      console.error("Error in fetch query:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await fetchProductBySlug(slug);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        // Always end loading state after a timeout
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    if (slug) {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Skeleton */}
          <div className="lg:w-1/2">
            <Skeleton className="aspect-square w-full rounded-xl" />
          </div>
          {/* Content Skeleton */}
          <div className="lg:w-1/2 space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
