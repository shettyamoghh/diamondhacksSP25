"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logoImage from "../assets/images/logosaas.png";
import MenuIcon from "../assets/icons/menu.svg";

export const Navbar = () => {
  const pathname = usePathname();
  // Treat /classes/* paths the same as /dashboard for nav items
  const isDashboard =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/classes");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="bg-black">
      <div className="px-4">
        <div className="py-4 flex items-center justify-between">
          <div className="relative">
            <a href="/" className="text-white text-3xl font-bold ml-5">
              RoadMapper
            </a>
          </div>

          <div className="border border-white border-opacity-30 h-10 w-10 inline-flex justify-center items-center rounded-lg sm:hidden">
            <MenuIcon className="text-white" />
          </div>

          <nav className="text-white sm:flex gap-6 items-center hidden">
            {isDashboard ? (
              <>
                <a
                  href="/dashboard"
                  className="text-opacity-60 text-white hover:opacity-100 transition"
                >
                  Dashboard
                </a>
                {/* <a
                  href="/classes"
                  className="text-opacity-60 text-white hover:opacity-100 transition"
                >
                  My Classes
                </a> */}
                {/* <a
                  href="/roadmaps"
                  className="text-opacity-60 text-white hover:opacity-100 transition"
                >
                  Roadmaps
                </a> */}
              </>
            ) : (
              <>
                <a
                  href="#features"
                  className="text-opacity-60 text-white hover:opacity-100 transition"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-opacity-60 text-white hover:opacity-100 transition"
                >
                  How It Works
                </a>
                <a
                  href="#faqs"
                  className="text-opacity-60 text-white hover:opacity-100 transition"
                >
                  FAQs
                </a>
                <a href="/dashboard">
                  <button className="bg-white py-2 px-4 rounded-lg text-black">
                    Log In / Sign Up
                  </button>
                </a>
              </>
            )}
            {isDashboard && (
              <div className="relative">
                <button onClick={toggleDropdown} className="focus:outline-none">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <span className="text-black font-bold">A</span>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
                    <a
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Profile
                    </a>
                    <a
                      href="/settings"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Settings
                    </a>
                    <a
                      href="/logout"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};
