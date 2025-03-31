'use client'
import { useState } from 'react'
import TrainList from '@/components/trainList'
import BookingForm from '@/components/bookTicket'
import { mockTrains } from '../constants/mockTrains'
import { Train } from '@/types/types';
import Image from 'next/image'

export default function Home() {
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  const handleBooking = async (bookingDetails: { passengers: number; date: string }) => {
    console.log('Booking details:', bookingDetails)
    setBookingConfirmed(true)
  }

  return (
    <div className="relative min-h-screen">
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
        <div className='w-full h-96 flex flex-col items-center justify-center my-24'>
          <h1 className="text-7xl font-bold mb-3 text-center text-white">Seamless Railway Booking at Your Fingertips!</h1>
          <h3 className='text-2xl text-white font-medium'>Book your tickets effortlessly and enjoy a hassle-free journey. Secure, fast, and reliable!</h3>
        </div>


        {!selectedTrain && !bookingConfirmed && (
          <TrainList trains={mockTrains} onSelect={setSelectedTrain} />
        )}

        {selectedTrain && !bookingConfirmed && (
          <BookingForm
            train={selectedTrain}
            onSubmit={handleBooking}
            onBack={() => setSelectedTrain(null)}
          />
        )}

        {bookingConfirmed && (
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">Booking Confirmed!</h2>
            <p className="mb-4">Your tickets have been successfully booked.</p>
            <button
              onClick={() => {
                setSelectedTrain(null)
                setBookingConfirmed(false)
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Book Another Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
