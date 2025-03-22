"use client";
import { useState } from "react";

export default function BookTicket() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    classType: "All Classes",
    category: "GENERAL",
    options: {
      disabilityConcession: false,
      flexibleDate: false,
      availableBerth: false,
      railwayPass: false,
    },
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        options: { ...formData.options, [name]: checked },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">BOOK TICKET</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* From and To Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="from"
            placeholder="From"
            value={formData.from}
            onChange={handleInputChange}
            className="border p-3 w-full rounded-lg"
          />
          <input
            type="text"
            name="to"
            placeholder="To"
            value={formData.to}
            onChange={handleInputChange}
            className="border p-3 w-full rounded-lg"
          />
        </div>

        {/* Date and Class Select */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="border p-3 w-full rounded-lg"
          />
          <select
            name="classType"
            value={formData.classType}
            onChange={handleInputChange}
            className="border p-3 w-full rounded-lg"
          >
            <option>All Classes</option>
            <option>AC First Class</option>
            <option>AC 2 Tier</option>
            <option>Sleeper Class</option>
          </select>
        </div>

        {/* Category Select */}
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="border p-3 w-full rounded-lg"
        >
          <option>GENERAL</option>
          <option>LADIES</option>
          <option>TATKAL</option>
          <option>PREMIUM TATKAL</option>
        </select>

        {/* Additional Options */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="disabilityConcession"
              checked={formData.options.disabilityConcession}
              onChange={handleInputChange}
              className="h-4 w-4"
            />
            <span>Person With Disability Concession</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="flexibleDate"
              checked={formData.options.flexibleDate}
              onChange={handleInputChange}
              className="h-4 w-4"
            />
            <span>Flexible With Date</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="availableBerth"
              checked={formData.options.availableBerth}
              onChange={handleInputChange}
              className="h-4 w-4"
            />
            <span>Train with Available Berth</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="railwayPass"
              checked={formData.options.railwayPass}
              onChange={handleInputChange}
              className="h-4 w-4"
            />
            <span>Railway Pass Concession</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Search
          </button>
          <button
            type="button"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Easy Booking on AskDISHA
          </button>
        </div>
      </form>
    </div>
  );
};

