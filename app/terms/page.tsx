// pages/terms-and-conditions.tsx
import Head from "next/head";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <>
      <Head>
        <title>Terms and Conditions | Divmurti</title>
        <meta name="description" content="Our terms of service and purchase conditions" />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
        <p className="mb-4">Last Updated: April 25, 2025</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Introduction</h2>
        <p className="mb-4">Welcome to our handcrafted Divmurti store. These Terms and Conditions govern your use of our website and purchase of our products. By accessing our website and placing an order, you agree to be bound by these Terms and Conditions.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Ordering Process</h2>
        <h3 className="text-lg font-medium mt-4 mb-2">Order Placement</h3>
        <ul className="list-disc pl-8 mb-4">
          <li>All orders must be placed through our official WhatsApp number as displayed on our website</li>
          <li>Orders are confirmed once payment has been received and verified</li>
          <li>We reserve the right to decline any order at our discretion</li>
        </ul>

        <h3 className="text-lg font-medium mt-4 mb-2">Payment</h3>
        <ul className="list-disc pl-8 mb-4">
          <li>All prices are listed in the currency displayed on our website</li>
          <li>Payment must be made in full before shipping</li>
          <li>We utilize secure third-party payment processors; their terms may also apply</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Product Information</h2>
        <h3 className="text-lg font-medium mt-4 mb-2">Product Descriptions</h3>
        <ul className="list-disc pl-8 mb-4">
          <li>We strive to display our products as accurately as possible</li>
          <li>Colors may vary slightly due to monitor settings and the handcrafted nature of our items</li>
          <li>Each spiritual artifact is handmade, making every piece unique with slight variations</li>
        </ul>

        <h3 className="text-lg font-medium mt-4 mb-2">Intellectual Property</h3>
        <ul className="list-disc pl-8 mb-4">
          <li>All content on our website, including images, descriptions, and designs, is our intellectual property</li>
          <li>Reproduction or use of our content without permission is prohibited</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Shipping and Delivery</h2>
        <h3 className="text-lg font-medium mt-4 mb-2">Shipping Times</h3>
        <ul className="list-disc pl-8 mb-4">
          <li>Estimated delivery times are provided but not guaranteed</li>
          <li>Factors outside our control may affect delivery schedules</li>
        </ul>

        <h3 className="text-lg font-medium mt-4 mb-2">Shipping Responsibility</h3>
        <ul className="list-disc pl-8 mb-4">
          <li>Risk transfers to the customer once the package is handed to the shipping carrier</li>
          <li>We are not responsible for delays, damages, or losses that occur during transit</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Return Policy</h2>
        <h3 className="text-lg font-medium mt-4 mb-2">Return Conditions</h3>
        <ul className="list-disc pl-8 mb-4">
          <li>Returns must be initiated within 24 hours of receiving the product</li>
          <li>After 24 hours, all sales are final and no returns will be accepted</li>
          <li>Customer is responsible for return shipping costs unless the item is defective</li>
        </ul>

        <h3 className="text-lg font-medium mt-4 mb-2">Return Process</h3>
        <ul className="list-disc pl-8 mb-4">
          <li>To initiate a return, contact us via WhatsApp with your order details</li>
          <li>Items must be returned in original packaging and in unused condition</li>
          <li>Refunds will be processed within 7-10 business days after we receive the returned item</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Liability Limitations</h2>
        <ul className="list-disc pl-8 mb-4">
          <li>We are not liable for any indirect, incidental, or consequential damages</li>
          <li>Our total liability shall not exceed the purchase price of the product</li>
          <li>We make no warranties regarding spiritual efficacy of our artifacts</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Modifications to Terms</h2>
        <p className="mb-4">We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to the website.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Governing Law</h2>
        <p className="mb-4">These Terms and Conditions are governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact Information</h2>
        <p className="mb-4">For questions regarding these Terms and Conditions, please contact us through our WhatsApp number listed on the website.</p>

        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    </>
  );
}