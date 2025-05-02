"use client"

import Image from "next/image"
import { MapPin, Mail, Phone, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  JaipurMurtiBhandar
                </span>
              </h1>
              <p className="text-xl font-medium text-gray-700 mb-6">
                Divine Art, Timeless Devotion
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Handcrafted marble statues that bring spiritual presence and aesthetic beauty to your sacred spaces.
              </p>
              <div className="flex space-x-4 ">
               <Link href={'/products'}>
                      <button className="px-6 py-3 cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center">
                  View Collection <ChevronRight className="ml-2 w-4 h-4" />
                </button>
               </Link>
         

              </div>
            </div>
            <div className="relative w-full h-64 lg:h-auto order-first lg:order-last">
              <Image
                src="/about-marble.png" // Replace with your image
                alt="JaipurMurtiBhandar Marble Statue"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden mb-12">
          <div className="p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  At <strong>JaipurMurtiBhandar</strong>, we specialize in hand-crafted marble statues of Hindu deities, designed to bring divine energy, beauty, and tradition into your home, temple, or sacred space.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Based in the heart of Agra, our artisans use age-old craftsmanship combined with modern precision to sculpt each murti with devotion and attention to detail. Whether you're looking for a serene idol of Lord Ganesha, the graceful form of Lakshmi, or the divine presence of Krishna, our collection offers something special for every devotee.
                </p>
              </div>
              <div className="space-y-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  We believe in delivering not just a product, but a spiritual connection. Our commitment to quality, authenticity, and customer satisfaction has made us a trusted name among spiritual seekers and collectors across India and beyond.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Every murti we create is more than just a sculpture—it's a divine embodiment crafted with reverence, designed to enhance your spiritual practice and create a sacred atmosphere in your space.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Craftsmanship Section */}
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
              <h2 className="text-3xl font-bold mb-6">Our Craftsmanship</h2>
              <p className="text-indigo-100 mb-6">
                Each statue passes through the hands of master artisans who have inherited generations of traditional knowledge.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Premium Makrana Marble</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Traditional Hand Carving</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Authentic Iconography</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Meticulous Finishing</span>
                </li>
              </ul>
            </div>
            
            {/* Updated to display the single image nicely */}
            <div className="relative overflow-hidden">
              <div className="relative w-full h-full min-h-96">
                <Image
                  src="/all.png"
                  alt="Our Marble Craftsmanship"
                  fill
                  className="object-contain p-6" 
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Map and Location */}
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Visit Our Workshop</h2>
              <p className="text-gray-700 text-lg mb-8">
                We welcome visitors to our workshop in Agra, where you can witness our artisans at work and explore our complete collection.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Address</h3>
                    <p className="text-gray-600">Pilipokhar, Hathras Rd, near Sonu Dhaba, opp. MS Farm House, Agra, Uttar Pradesh 282006</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">+91 82733 66089</p>
                  </div>
                </div>
                
                {/* <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">info@JaipuMurtiBhandar.com</p>
                  </div>
                </div> */}
                
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Hours</h3>
                    <p className="text-gray-600">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative w-full h-96 lg:h-auto">
              {/* Updated map with specific location for Jaipur Murti Bhandaar */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d443.59092346334695!2d78.04414147447797!3d27.25918195068673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39747b0309bca6bb%3A0x3c6a4d435553465c!2sJaipur%20Murti%20Bhandaar!5e0!3m2!1sen!2sin!4v1713785850245!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}