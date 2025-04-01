"use client";
import Image from "next/image";

export default function Services() {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Header Section */}
      <div className="relative w-full h-72">
        <Image
          src={"/bg.jpg"}
          alt={"services background"}
          layout="fill"
          objectFit="cover"
          className="brightness-30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-6xl font-bold text-white">Our Services</h1>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-6xl mx-auto py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
        {/* Service 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-2xl font-semibold text-blue-600">Ticket Booking</h2>
          <p className="mt-4 text-gray-600">
            Easily book your tickets with real-time seat availability, secure
            payments, and instant confirmation.
          </p>
        </div>

        {/* Service 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-2xl font-semibold text-green-600">PNR Status</h2>
          <p className="mt-4 text-gray-600">
            Check your PNR status instantly to stay updated about your ticket
            confirmation and journey details.
          </p>
        </div>

        {/* Service 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-2xl font-semibold text-orange-600">Real-Time Updates</h2>
          <p className="mt-4 text-gray-600">
            Get real-time train schedules, arrival/departure updates, and
            notifications to stay informed.
          </p>
        </div>

        {/* Service 4 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-2xl font-semibold text-purple-600">Cancellation & Refund</h2>
          <p className="mt-4 text-gray-600">
            Cancel your tickets with ease and receive quick refunds with our
            hassle-free process.
          </p>
        </div>

        {/* Service 5 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-2xl font-semibold text-red-600">Customer Support</h2>
          <p className="mt-4 text-gray-600">
            Our 24/7 customer support team is here to assist you with all your
            queries and concerns.
          </p>
        </div>

        {/* Service 6 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-2xl font-semibold text-teal-600">Seat Selection</h2>
          <p className="mt-4 text-gray-600">
            Choose your preferred seats during booking and enjoy a comfortable
            journey.
          </p>
        </div>
      </div>
    </div>
  );
}
