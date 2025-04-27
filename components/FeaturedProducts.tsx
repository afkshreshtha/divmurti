"use client";

import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity.cli";
import imageUrlBuilder from "@sanity/image-url";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: string;
  images: any[];
  paintingStyle: string;
  category?: {
    title: string;
    slug: { current: string };
  };
  featured?: boolean;
  dimensions?: {
    height?: { value: number; unit?: { symbol: string } };
    width?: { value: number; unit?: { symbol: string } };
    length?: { value: number; unit?: { symbol: string } };
  };
  slug: { current: string };
}

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const query = `*[_type == "product" && featured == true] {
          _id,
          name,
          price,
          paintingStyle,
          images,
          category->{
            title,
            slug
          },
          featured,
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
  },
          slug,
        }[0...4]`; // Limit to 4 featured products

        const products = await client.fetch(query);
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <p>Loading featured products...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold tracking-wider text-indigo-600 uppercase">
            Handcrafted Excellence
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Featured Artisan Creations
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Meticulously crafted spiritual artifacts for your sacred spaces
          </p>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured products available</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => {
               return (
                  <div
                    key={product._id}
                    className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden"
                  >
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-xl bg-gray-200">
                      <div className="relative h-80 w-full">
                        {product.images?.length > 0 ? (
                          <Image
                            src={urlFor(product.images[0]).url()}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={product._id === featuredProducts[0]?._id}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-100">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>
                      {product.category && (
                        <Link
                          href={`/category/${product.category.slug.current}`}
                          className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm hover:bg-white transition-colors z-20" // Add z-20 here
                        >
                          <span className="text-xs font-medium text-gray-900 hover:text-indigo-600">
                            {product.category.title}
                          </span>
                        </Link>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            <Link
                              href={`/product/${product.slug.current}`}
                              passHref
                            >
                              <span
                                className="absolute inset-0 z-10"
                                aria-hidden="true"
                              />
                              {product.name}
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
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
                            {product.paintingStyle}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{product.price}
                        </p>
                        <Link
                          href={`/products/${product.slug.current}`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Browse All Collections
                <svg
                  className="ml-3 -mr-1 w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
