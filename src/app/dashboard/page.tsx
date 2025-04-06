import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function Dashboard() {
  // Create 4 placeholder cards for classes
  const placeholders = Array(4).fill(null);
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-2">Your Classes</h2>
          <p className="text-gray-300 mb-4">
            Manage your classes and create personalized study roadmaps.
          </p>
          <Link href="/add-class">
            <button className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition">
              Add New Class
            </button>
          </Link>
        </section>

        {/* Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {placeholders.map((_, index) => (
            <div
              key={index}
              className="border-2 border-dashed border-[#FF6B00] rounded-lg h-40 flex items-center justify-center bg-gray-900"
            >
              {index === 0 ? (
                <Link href="/add-class">
                  <div className="flex flex-col items-center cursor-pointer">
                    <div className="text-5xl font-bold text-[#FF6B00]">+</div>
                    <span className="mt-2 text-[#FF6B00]">Add Class</span>
                  </div>
                </Link>
              ) : (
                <span className="text-gray-500">Empty</span>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
