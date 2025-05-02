"use client"
import { useState } from 'react';
import Head from 'next/head';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

export default function OurStores() {
  const [activeStore, setActiveStore] = useState(0);
  
  const stores = [
    {
      id: 1,
      name: "Jaipur Murti Bhandar - Agra",
      address: "Pili Phokar, Agra",
      state: "Uttar Pradesh, India",
      phone: "+91 8273366089",
      email: "shreshtha1345@gmail.com",
      hours: "9:00 AM - 7:00 PM",
      // Using the exact coordinates from your Google Maps link
      mapEmbedUrl: "https://maps.google.com/maps?q=27.259148,78.0442409&z=15&output=embed",
      mapDirectionsUrl: "https://www.google.com/maps/search/jaipur+murti+bhandar+agra/@27.259148,78.0442409,15z",
      description: "Our flagship store featuring the largest collection of handcrafted marble idols and sculptures."
    },
    {
      id: 2,
      name: "Jaipur Murti Bhandar - Haathi Ghat",
      address: "Near Gurudwara Haathi Ghat, Agra",
      state: "Uttar Pradesh, India",
      phone: "+91 9876543210", // Replace with actual phone
      email: "haathighat@JaipurMurtiBhandar.com", // Replace with actual email
      hours: "10:00 AM - 8:00 PM",
      // Using the exact coordinates from your second Google Maps link
      mapEmbedUrl: "https://maps.google.com/maps?q=27.18485,78.0235667&z=15&output=embed",
      mapDirectionsUrl: "https://www.google.com/maps/place/Gurudwara+Haathi+Ghat/@27.18485,78.0235667,15z",
      description: "Our showroom near the historic Haathi Ghat area, offering a wide selection of divine marble sculptures."
    },
    {
      id: 3,
      name: "Kuber Murti Bhandar",
      address: "Opposite NEXA (KTL PVT LTD), Kuberpur",
      state: "Agra, Uttar Pradesh, India",
      phone: "+91 9876543212", // Replace with actual phone
      email: "kuberpur@JaipurMurtiBhandar.com", // Replace with actual email
      hours: "9:30 AM - 7:30 PM",
      mapEmbedUrl: "https://maps.google.com/maps?q=27.228511,78.147031&z=15&output=embed",
      mapDirectionsUrl: "https://www.google.com/maps/place/%E0%A4%95%E0%A5%81%E0%A4%AC%E0%A5%87%E0%A4%B0+%E0%A4%AE%E0%A5%82%E0%A4%B0%E0%A5%8D%E0%A4%A4%E0%A4%BF+%E0%A4%AD%E0%A4%A3%E0%A5%8D%E0%A4%A1%E0%A4%BE%E0%A4%B0/@27.228647,78.1469029,3a,75y,130.92h,93.74t/data=!3m7!1e1!3m5!1sBsQ3tFazGBDgUZ4el7M8hA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-3.7358623537362092%26panoid%3DBsQ3tFazGBDgUZ4el7M8hA%26yaw%3D130.9213503733858!7i13312!8i6656!4m12!1m5!3m4!2zMjfCsDEzJzQ0LjMiTiA3OMKwMDgnNDcuOCJF!8m2!3d27.228958!4d78.1466133!3m5!1s0x39746f864dd63a2d:0xe1c294e3a81b463!8m2!3d27.228511!4d78.147031!16s%2Fg%2F11vf3y153v",
      description: "Our Kuberpur showroom offering exquisite marble sculptures and idols."
    }
  ];
  

  return (
    <>
      <Head>
        <title>Our Stores | JaipurMurtiBhandar - Official Website of Jaipur Murti Bhandar</title>
        <meta name="description" content="Visit our Jaipur Murti Bhandar stores in Agra, Jaipur, and Delhi. Experience our handcrafted marble idols in person." />
      </Head>

      <div className="bg-gray-50 py-12 md:py-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Stores
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              JaipurMurtiBhandar is the online presence of Jaipur Murti Bhandar. Visit any of our physical locations to experience our divine marble craftsmanship in person.
            </p>
          </div>
        </div>

        {/* Store Locations Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Store Selector */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Select a Location</h2>
              
              <div className="space-y-4">
                {stores.map((store, index) => (
                  <div 
                    key={store.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      activeStore === index 
                        ? 'bg-blue-50 border-l-4 border-blue-500 shadow-sm' 
                        : 'bg-white border border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                    }`}
                    onClick={() => setActiveStore(index)}
                  >
                    <h3 className="font-medium text-gray-900">{store.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{store.address}, {store.state}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-blue-700 text-white rounded-lg shadow-lg">
                <h3 className="font-semibold text-lg mb-2">Visit JaipurMurtiBhandar Stores</h3>
                <p className="text-blue-100 mb-4">Experience our sacred marble idols in person and speak with our expert artisans.</p>
                <a 
                  href="tel:+918273366089" 
                  className="inline-flex items-center bg-white text-blue-700 px-4 py-2 rounded font-medium text-sm transition-colors duration-200 hover:bg-blue-50"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </div>
            </div>
            
            {/* Store Details and Map */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Map */}
                <div className="h-64 sm:h-80 md:h-96 w-full bg-gray-200 relative">
                  <iframe 
                    src={stores[activeStore].mapEmbedUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    aria-label={`Google Map showing location of ${stores[activeStore].name}`}
                  ></iframe>
                </div>
                
                {/* Store Information */}
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-start">
                    <div>
                      <h2 className="font-bold text-2xl text-gray-900">{stores[activeStore].name}</h2>
                      <p className="text-gray-600 mt-2">{stores[activeStore].description}</p>
                    </div>
                    <a 
                      href={stores[activeStore].mapDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="mt-2 md:mt-0 inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      Get Directions <ExternalLink className="ml-1 w-4 h-4" />
                    </a>
                  </div>
                  
                  <hr className="my-6" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex">
                        <MapPin className="text-blue-500 h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Address</h3>
                          <address className="not-italic text-gray-600 mt-1">
                            {stores[activeStore].address}<br />
                            {stores[activeStore].state}
                          </address>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <Clock className="text-blue-500 h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Hours</h3>
                          <p className="text-gray-600 mt-1">
                            Monday - Saturday: {stores[activeStore].hours}<br />
                            Sunday: Closed
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex">
                        <Phone className="text-blue-500 h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Phone</h3>
                          <a href={`tel:${stores[activeStore].phone}`} className="text-gray-600 hover:text-blue-600 mt-1 block">
                            {stores[activeStore].phone}
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <Mail className="text-blue-500 h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Email</h3>
                          <a href={`mailto:${stores[activeStore].email}`} className="text-gray-600 hover:text-blue-600 mt-1 block">
                            {stores[activeStore].email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=I'm interested in visiting your ${stores[activeStore].name} location. Can you provide more information?`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-medium text-sm transition-colors duration-200"
                    >
                      Contact This Store on WhatsApp
                      <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413A11.815 11.815 0 0012.05 0zm0 21.783a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Banner */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            JaipurMurtiBhandar: The Online Store of <span className="text-blue-400">Jaipur Murti Bhandar</span>
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            For over 25 years, Jaipur Murti Bhandar has been crafting divine marble sculptures. 
            JaipurMurtiBhandar brings this sacred art directly to your doorstep with the same quality and craftsmanship 
            available at our physical locations.
          </p>
        </div>
      </div>
    </>
  );
}