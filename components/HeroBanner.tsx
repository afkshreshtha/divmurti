import Image from "next/image";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 px-6 md:px-12 overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-400 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-amber-200 mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            <span className="text-blue-600">Divine Artistry</span> in
            <br />
            Pure Makrana Marble
          </h1>
          <p className="mt-4 text-gray-600 text-lg md:text-xl max-w-lg leading-relaxed">
            Handcrafted by Jaipur&apos;s master artisans, our marble deities
            embody centuries of sacred tradition and unmatched craftsmanship.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/products"
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
            >
              Explore Collection
            </Link>
            <Link
              href="/about"
              className="border-2 border-gray-300 hover:border-gray-400 text-gray-800 px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:bg-gray-50 text-center"
            >
              Our Craftsmanship
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full h-80 md:h-[400px] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/herobanner.png"
            alt="Exquisite marble deity sculpture from Jaipur"
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />
          {/* Image overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10"></div>
        </div>
      </div>
    </section>
  );
}
