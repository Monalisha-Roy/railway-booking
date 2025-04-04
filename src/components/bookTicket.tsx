"use client";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

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
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState({
    stations: true,
    trains: false,
    classes: false
  });

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    train_id: "",
    date: new Date().toISOString().split("T")[0],
    classType: "All Classes",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);


  // Fetch Stations on Load
  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(prev => ({ ...prev, stations: true }));

    fetch("/api/getStations", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setStations(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch stations:", err.message);
        }
      })
      .finally(() => setIsLoading(prev => ({ ...prev, stations: false })));

    return () => controller.abort();
  }, []);

  // Fetch Available Trains
  useEffect(() => {
    if (formData.from && formData.to) {
      const controller = new AbortController();
      setIsLoading(prev => ({ ...prev, trains: true }));
      setFetchError(null);

      const params = new URLSearchParams({
        from: formData.from,
        to: formData.to
      });

      fetch(`/api/getTrains?${params}`, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then((data) => {
          setTrains(data);
          setFetchError(null);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setFetchError(err.message);
            setTrains([]);
          }
        })
        .finally(() => setIsLoading(prev => ({ ...prev, trains: false })));

      return () => controller.abort();
    }
  }, [formData.from, formData.to]);

  useEffect(() => {
    if (!formData.train_id || !formData.to) return;  // Trigger only when train_id changes

    const selectedFrom = stations.find((s) => s.station_name === formData.from);
    const selectedTo = stations.find((s) => s.station_name === formData.to);

    if (!selectedFrom || !selectedTo) {
      setAvailableClasses([]);
      return;
    }

    const controller = new AbortController();
    setIsLoading(prev => ({ ...prev, classes: true }));

    fetch(`/api/getSeats?train_id=${formData.train_id}&station_name=${selectedFrom.station_name}`, {
      signal: controller.signal
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: { classType: string; availableSeats: number }[]) => {
        setAvailableClasses([...new Set(data.map(item => item.classType))]);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Seat availability error:", err.message);
          setAvailableClasses([]);
        }
      })
      .finally(() => setIsLoading(prev => ({ ...prev, classes: false })));

    return () => controller.abort();
  }, [formData.train_id]);  // ✅ Only runs when train_id changes


  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'from' || name === 'to') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        train_id: '' // Reset train selection when stations change
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle Ticket Booking
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Date validation
  const selectedDate = new Date(formData.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    alert("Please select a date in the future");
    return;
  }

  if (!formData.train_id) {
    alert("Please select a train");
    return;
  }

  // Open the modal after successful validation
  setIsModalOpen(true);
};

  const handleDownloadTicket = () => {
    if (!ticketRef.current) return;
    html2canvas(ticketRef.current).then((canvas: { toDataURL: () => string; }) => {
      const link = document.createElement("a");
      link.download = `Ticket_${formData.train_id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="w-full h-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Book Train Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* From Station */}
        <div className="relative">
          <select
            name="from"
            value={formData.from}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            disabled={isLoading.stations}
          >
            <option value="">{isLoading.stations ? "Loading stations..." : "Select Departure Station"}</option>
            {stations.map((s) => (
              <option key={s.station_id} value={s.station_name}>
                {s.station_name}
              </option>
            ))}
          </select>
        </div>

        {/* To Station */}
        <div className="relative">
          <select
            name="to"
            value={formData.to}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            disabled={isLoading.stations}
          >
            <option value="">{isLoading.stations ? "Loading stations..." : "Select Destination Station"}</option>
            {stations
              .filter((s) => s.station_name !== formData.from)
              .map((s) => (
                <option key={s.station_id} value={s.station_name}>
                  {s.station_name}
                </option>
              ))}
          </select>
        </div>

        {/* Available Trains */}
        {formData.from && formData.to && (
          <div className="relative">
            <select
              name="train_id"
              value={formData.train_id}
              onChange={handleChange}
              className="border p-3 w-full rounded"
              disabled={isLoading.trains}
            >
              <option value="">
                {isLoading.trains ? "Loading trains..." : "Select a Train"}
              </option>
              {trains.map((t) => (
                <option key={t.train_id} value={String(t.train_id)}>
                  {t.train_name} ({t.from_station} → {t.to_station})
                </option>
              ))}
            </select>
            {!isLoading.trains && trains.length === 0 && (
              <p className="text-red-500 text-center mt-2">
                {fetchError ? `Error: ${fetchError}` : "No trains available for the selected route"}
              </p>
            )}
          </div>
        )}

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          min={new Date().toISOString().split('T')[0]} // Restrict to current and future dates
          max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            .toISOString()
            .split('T')[0]} // Optional: Restrict to within one year from today
        />

        {/* Class Type */}
        <div className="relative">
          <select
            name="classType"
            value={formData.classType}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            disabled={isLoading.classes}
          >
            <option value="All Classes">
              {isLoading.classes ? "Loading classes..." : "All Classes"}
            </option>
            {[...new Set(availableClasses)].map((classType) => (
              <option key={`class-${classType}`} value={classType}>
                {classType}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isLoading.trains || isLoading.classes || !formData.from || !formData.to || !formData.train_id}
        >
          {isLoading.trains || isLoading.classes ? "Processing..." : "Book Now"}
        </button>

      </form>

      {/* Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center" ref={ticketRef}>
            <h2 className="text-xl font-bold mb-4">Train Ticket</h2>
            <p><strong>Train:</strong> {trains.find((t) => t.train_id === Number(formData.train_id))?.train_name}</p>
            <p><strong>From:</strong> {formData.from}</p>
            <p><strong>To:</strong> {formData.to}</p>
            <p><strong>Date:</strong> {formData.date}</p>
            <p><strong>Class:</strong> {formData.classType}</p>
            <button className="bg-green-500 text-white px-4 py-2 mt-4 rounded" onClick={handleDownloadTicket}>Download</button>
            <button className="bg-red-500 text-white px-4 py-2 mt-4 rounded ml-2" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}