import Navbar from "@/components/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white flex items-center justify-center">
        <Navbar />
       <h1>Railway Booking Management System</h1>
    </div>
  );
}
