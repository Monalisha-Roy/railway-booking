"use client";
import { useEffect, useState } from "react";

// Type Definitions
interface Station {
  station_id: number;
  station_name: string;
}

interface Train {
  train_id: number;
  train_name: string;
  from_station: string;
  to_station: string;
  price: number;
}

export default function BookTicket() {
  const [stations, setStations] = useState<Station[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    train_id: "",
    date: new Date().toISOString().split("T")[0],
    classType: "All Classes",
  });

  // Fetch Stations on Load
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/getStations", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Error fetching stations: ${res.statusText}`);
        return res.json();
      })
      .then((data) => setStations(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch stations:", err.message);
        }
      });

    return () => controller.abort(); // Cleanup on unmount
  }, []);

  // Fetch Available Trains
  useEffect(() => {
    if (formData.from && formData.to) {
      const controller = new AbortController();
      const url = `/api/getTrains?from=${formData.from}&to=${formData.to}`;
      console.log("Fetching trains from URL:", url);
      fetch(url, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) {
            // console.error(`Error fetching trains: ${res.status} ${res.statusText}`);
            // throw new Error(`Error fetching trains: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => setTrains(data))
        .catch((err) => {
          if (err.name !== "AbortError") {
            //console.error("Failed to fetch trains:", err.message);
            setTrains([]); // Reset trains to an empty array on error
          }
        });

      return () => controller.abort(); // Cleanup on unmount
    }
  }, [formData.from, formData.to]);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking Data:", formData);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Book Train Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* From Station */}
        <select name="from" value={formData.from} onChange={handleChange} className="border p-3 w-full rounded">
          <option value="">Select Departure Station</option>
          {stations.map((s) => (
            <option key={s.station_id} value={s.station_name}>{s.station_name}</option>
          ))}
        </select>

        {/* To Station */}
        <select name="to" value={formData.to} onChange={handleChange} className="border p-3 w-full rounded">
          <option value="">Select Destination Station</option>
          {stations.filter((s) => s.station_name !== formData.from).map((s) => (
            <option key={s.station_id} value={s.station_name}>{s.station_name}</option>
          ))}
        </select>

        {/* Available Trains */}
        {trains.length > 0 ? (
          <select name="train_id" value={formData.train_id} onChange={handleChange} className="border p-3 w-full rounded">
            <option value="">Select a Train</option>
            {trains.map((t) => (
              <option key={t.train_id} value={String(t.train_id)}>
                {t.train_name} ({t.from_station} → {t.to_station}) 
              </option>
            ))}
          </select>
        ) : (
          formData.from &&
          formData.to && (
            <p className="text-red-500 text-center">
              {trains.length === 0 ? "No trains available for the selected route." : "Error fetching train data. Please try again later."}
            </p>
          )
        )}

        {/* Date Picker */}
        <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-3 w-full rounded" />

        {/* Class Type */}
        <select name="classType" value={formData.classType} onChange={handleChange} className="border p-3 w-full rounded">
          <option>All Classes</option>
          <option>AC First Class</option>
          <option>AC 2 Tier</option>
          <option>Sleeper Class</option>
        </select>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600">Book Now</button>
      </form>
    </div>
  );
}
