import React, { useState } from 'react'
import { Train } from '@/types/types'

interface BookingFormProps {
  train: Train
  onSubmit: (bookingDetails: { passengers: number; date: string }) => Promise<void>
  onBack: () => void
}

// ✅ Add `React.FC` to enforce type checking
const BookingForm: React.FC<BookingFormProps> = ({ train, onSubmit, onBack }) => {
  const [passengers, setPassengers] = useState<number>(1)
  const [date, setDate] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ passengers, date })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Book {train.name}</h2>

      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-blue-600 hover:text-blue-800"
      >
        ← Back to trains
      </button>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Travel Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Passengers</label>
        <input
          type="number"
          min="1"
          max="6"
          className="w-full p-2 border rounded"
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        Confirm Booking
      </button>
    </form>
  )
}

// ✅ Default export for import in Home.tsx
export default BookingForm
