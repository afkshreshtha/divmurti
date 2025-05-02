import Link from 'next/link';
import { Instagram, Facebook, Youtube, Phone, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 ">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Branding */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            <span className="text-blue-400">Jaipur</span>murtibhandar
          </h2>
          <p className="text-sm leading-relaxed">
            The official online store of <span className="font-medium text-blue-400">Jaipur Murti Bhandar</span>. 
            Sacred marble idols handcrafted in Jaipur with generations of expertise. Divine art for your home and temple.
          </p>
          
          {/* Social Media */}
          {/* <div className="flex space-x-4 pt-2">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Youtube size={20} />
            </a>
          </div> */}
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <Link 
                href="/products" 
                className="text-sm hover:text-blue-400 transition-colors duration-200 flex items-center"
              >
                <span className="w-1 h-1 bg-gray-400 mr-2 rounded-full"></span>
                Products
              </Link>
            </li>
            <li>
              <Link 
                href="/categories" 
                className="text-sm hover:text-blue-400 transition-colors duration-200 flex items-center"
              >
                <span className="w-1 h-1 bg-gray-400 mr-2 rounded-full"></span>
                Categories
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                className="text-sm hover:text-blue-400 transition-colors duration-200 flex items-center"
              >
                <span className="w-1 h-1 bg-gray-400 mr-2 rounded-full"></span>
                About Us
              </Link>
            </li>
            <li>
              <Link 
                href="/our-stores" 
                className="text-sm hover:text-blue-400 transition-colors duration-200 flex items-center"
              >
                <span className="w-1 h-1 bg-gray-400 mr-2 rounded-full"></span>
                Visit Our Store
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Visit Our Store</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <MapPin className="flex-shrink-0 h-4 w-4 text-blue-400 mt-0.5 mr-2" />
              <address className="not-italic">
                <span className="font-medium">Jaipur Murti Bhandar</span><br />
                Pili Phokar, Agra<br />
                UttarPradesh, India
              </address>
            </li>
            <li className="flex items-center">
              <Phone className="h-4 w-4 text-blue-400 mr-2" />
              <a href="tel:+918273366089" className="hover:text-blue-400 transition-colors duration-200">
                +91 8273366089
              </a>
            </li>
            <li className="flex items-center">
              <Mail className="h-4 w-4 text-blue-400 mr-2" />
              <a href="mailto:shreshtha1345@gmail.com" className="hover:text-blue-400 transition-colors duration-200">
                shreshtha1345@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* WhatsApp CTA */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
          <p className="text-sm mb-4">
            Have questions about our marble idols? Chat directly with our artisans from Jaipur Murti Bhandar.
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200"
          >
            WhatsApp Now
            <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </div>


      {/* Copyright */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Jaipur Murti Bhandar. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors duration-200">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors duration-200">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-gray-300 transition-colors duration-200">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}