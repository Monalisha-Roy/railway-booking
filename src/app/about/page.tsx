"use client";
import Image from "next/image";

export default function About() {
  return (
    <div className="w-full min-h-screen relative flex items-center justify-center bg-gray-100 p-8">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={"/bg.jpg"}
          alt={"background image"}
          layout="fill"
          objectFit="cover"
          className="z-0 brightness-30"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-8/12 text-center text-white space-y-6 p-6 bg-black/60 rounded-2xl shadow-lg py-20">
        <h1 className="text-4xl font-bold">About UrbanGlide</h1>
        <p className="text-lg leading-relaxed">
          UrbanGlide is a modern railway booking system designed to simplify the
          process of reserving train tickets. Our platform offers a seamless
          user experience, enabling passengers to easily book, manage, and
          modify their journey with just a few clicks.
        </p>
        <p className="text-lg">
          We aim to provide a reliable and efficient booking service with real-time updates,
          multiple payment options, and 24/7 customer support.
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="bg-blue-300 px-6 py-2 rounded-lg text-white font-semibold hover:bg-blue-400 transition">
            Easy Booking
          </div>
          <div className="bg-green-600 px-6 py-2 rounded-lg text-white font-semibold hover:bg-green-700 transition">
            Real-Time Updates
          </div>
          <div className="bg-blue-600 px-6 py-2 rounded-lg text-white font-semibold hover:bg-blue-700 transition">
            Secure Payments
          </div>
        </div>
      </div>
    </div>
  );
}
