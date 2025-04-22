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
  price?: number; // Optional price field added
}

interface SeatData {
  classType: string;
  availableSeats: number;
  price: number; // Price field for each class type
}

export default function BookTicket() {
  const [stations, setStations] = useState<Station[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [availableClasses, setAvailableClasses] = useState<SeatData[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState({
    stations: true,
    trains: false,
    classes: false,
  });

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    train_id: "",
    date: new Date().toISOString().split("T")[0],
    classType: "All Classes",
    price: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading((prev) => ({ ...prev, stations: true }));

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
      .finally(() =>
        setIsLoading((prev) => ({ ...prev, stations: false }))
      );

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (formData.from && formData.to) {
      const controller = new AbortController();
      setIsLoading((prev) => ({ ...prev, trains: true }));
      setFetchError(null);

      const params = new URLSearchParams({
        from: formData.from,
        to: formData.to,
      });

      fetch(`/api/getTrains?${params}`, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then((data) => {
          // Add random price to each train
          const updatedTrains = data.map((train: Train) => ({
            ...train,
            price: Math.floor(Math.random() * 500) + 100,
          }));
          setTrains(updatedTrains);
          setFetchError(null);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setFetchError(err.message);
            setTrains([]);
          }
        })
        .finally(() =>
          setIsLoading((prev) => ({ ...prev, trains: false }))
        );

      return () => controller.abort();
    }
  }, [formData.from, formData.to]);

  useEffect(() => {
    if (!formData.train_id || !formData.to) return;
  
    const selectedFrom = stations.find((s) => s.station_name === formData.from);
    const selectedTo = stations.find((s) => s.station_name === formData.to);
  
    if (!selectedFrom || !selectedTo) {
      setAvailableClasses([]);
      return;
    }
  
    const controller = new AbortController();
    setIsLoading((prev) => ({ ...prev, classes: true }));
  
    fetch(`/api/getSeats?train_id=${formData.train_id}&station_name=${selectedFrom.station_name}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: { classType: string; availableSeats: number }[]) => {
        const basePrice = Math.floor(Math.random() * 200) + 467;
        const classesWithPrices = data.map((item, index) => ({
          ...item,
          price: basePrice - index * 130,
        }));
        setAvailableClasses(classesWithPrices);
  
        const selectedTrain = trains.find((t) => t.train_id === Number(formData.train_id));
        if (selectedTrain && selectedTrain.price) {
          setFormData((prev) => ({ ...prev, price: selectedTrain.price ?? 0 }));
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Seat availability error:", err.message);
          setAvailableClasses([]);
        }
      })
      .finally(() =>
        setIsLoading((prev) => ({ ...prev, classes: false }))
      );
  
    return () => controller.abort();
  }, [formData.train_id, formData.to, formData.from, stations, trains]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "from" || name === "to") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        train_id: "",
        price: 0,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    // Find the selected class price based on selected class
    const selectedClass = availableClasses.find(
      (cls) => cls.classType === formData.classType
    );
    if (selectedClass) {
      setFormData((prev) => ({ ...prev, price: selectedClass.price }));
    }

    setIsModalOpen(true);
  };

  const handleDownloadTicket = () => {
    if (!ticketRef.current) return;
    html2canvas(ticketRef.current).then((canvas) => {
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
        <select
          name="from"
          value={formData.from}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          disabled={isLoading.stations}
        >
          <option value="">
            {isLoading.stations ? "Loading stations..." : "Select Departure Station"}
          </option>
          {stations.map((s) => (
            <option key={s.station_id} value={s.station_name}>
              {s.station_name}
            </option>
          ))}
        </select>

        <select
          name="to"
          value={formData.to}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          disabled={isLoading.stations}
        >
          <option value="">
            {isLoading.stations ? "Loading stations..." : "Select Destination Station"}
          </option>
          {stations
            .filter((s) => s.station_name !== formData.from)
            .map((s) => (
              <option key={s.station_id} value={s.station_name}>
                {s.station_name}
              </option>
            ))}
        </select>

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
          min={new Date().toISOString().split("T")[0]}
          max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]}
        />

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
          {availableClasses
            .slice()
            .map(({ classType, price }: { classType: string; price: number }) => (
              <option key={classType} value={classType}>
                {classType} — ₹{price}
              </option>
            ))}
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isLoading.trains || isLoading.classes || !formData.from || !formData.to || !formData.train_id}
        >
          {isLoading.trains || isLoading.classes ? "Processing..." : "Book Now"}
        </button>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96 text-center border-4 border-dashed border-gray-400 relative"
            ref={ticketRef}
            style={{
              backgroundImage: "linear-gradient(to bottom, #f9f9f9, #eaeaea)",
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-4 bg-gray-300 rounded-t-lg"></div>
            <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-300 pb-2">
              Train Ticket
            </h2>
            <p className="text-left">
              <strong>Train:</strong>{" "}
              {trains.find((t) => t.train_id === Number(formData.train_id))?.train_name}
            </p>
            <p className="text-left">
              <strong>From:</strong> {formData.from}
            </p>
            <p className="text-left">
              <strong>To:</strong> {formData.to}
            </p>
            <p className="text-left">
              <strong>Date:</strong> {formData.date}
            </p>
            <p className="text-left">
              <strong>Class:</strong> {formData.classType}
            </p>
            <p className="text-left">
              <strong>Price:</strong> ₹{formData.price} INR
            </p>
            <div className="mt-4 border-t-2 border-gray-300 pt-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleDownloadTicket}
              >
                Download
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded ml-2 hover:bg-red-600"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-4 bg-gray-300 rounded-b-lg"></div>
          </div>
        </div>
      )}
    </div>
  );
}
