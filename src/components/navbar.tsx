"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Services",
    path: "/services",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Contact Us",
    path: "/contact",
  },
];

export default function Navbar() {
  const [isTop, setIsTop] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsTop(false);
      } else {
        setIsTop(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav className={` fixed w-full z-20 transition-all duration-300 ${isTop ? "bg-transparent" : "bg-black shadow-lg"}`}>
        <div className="flex items-center justify-between h-14 px-20">
        <Image src={"/logo.png"} alt="logo" width={65} height={60} className="rounded-full p-2"/>
          <div className="space-x-12 flex justify-center items-center">
            
            {links.map((link) => (
              <Link key={link.name} href={link.path} className={`text-white hover:text-primary ${pathname === link.path ? "font-bold" : ""}`}>
                {link.name}
              </Link>
            ))}
            <div className="space-x-3">
              <button className="border border-white text-white p-2 rounded-lg px-5 hover:scale-105">Signup</button>
              <button className="border border-white text-white p-2 rounded-lg px-5 hover:scale-105">Login</button>
            </div>

          </div>
        </div>
      </nav>
      <nav></nav>
    </>
  );
}