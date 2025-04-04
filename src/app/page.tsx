"use client";

import { useState } from "react";
import TrainList from "@/components/trainList";
import type { Train } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleBooking = async (bookingDetails: { passengers: number; date: string }) => {
    console.log("Booking details:", bookingDetails);
    setBookingConfirmed(true);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={"/hero.png"}
          alt={"background image"}
          layout="fill"
          objectFit="cover"
          className="brightness-40"
        />
      </div>

      <div className="w-11/12 mx-auto p-8">
        {/* Hero Section */}
        <div className="w-full h-96 flex flex-col items-center justify-center my-24">
          <h1 className="text-7xl font-bold mb-3 text-center text-white">
            Seamless Railway Booking at Your Fingertips!
          </h1>
          <h3 className="text-2xl text-white font-medium">
            Book your tickets effortlessly and enjoy a hassle-free journey. Secure, fast, and reliable!
          </h3>
          <Link href={"/booktickets"}>
          <button className="p-3 px-5 hover:bg-[#263a69] hover:cursor-pointer bg-[#7d97d9] text-white font-semibold rounded-lg mt-3">Book Tickets</button>
          </Link>
        </div>

        {/* Train List */}
        <TrainList onSelect={setSelectedTrain} />

        
      </div>
    </div>
  );
}
