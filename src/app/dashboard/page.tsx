"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { AddClassModal } from "@/components/AddClassModal";

export default function Dashboard() {
  // Create 4 placeholder cards for classes
  const placeholders = Array(4).fill(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddClassClick = () => {
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      {/* Main Content */}
      <main className="container mx-auto px-4 pt-16 pb-8 text-center">
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-5xl font-semibold mb-2">Your Classes</h2>
          <p className="text-gray-300 mb-4 text-xl">
            Manage your classes and create personalized study roadmaps.
          </p>
          <button
            onClick={handleAddClassClick}
            className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition"
          >
            Sync with Canvas
          </button>
        </motion.section>
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {placeholders.map((_, index) => (
            <div
              key={index}
              className="border-2 border-dashed border-gray-500 rounded-lg h-[24rem] flex items-center justify-center bg-black"
            >
              {index === 0 ? (
                <button
                  onClick={handleAddClassClick}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div className="text-5xl font-bold text-[#FF6B00]">+</div>
                  <span className="mt-2 text-[#FF6B00] text-xl">Add Class</span>
                </button>
              ) : (
                <span className="text-gray-500 text-xl">Empty</span>
              )}
            </div>
          ))}
        </motion.section>
      </main>
      {modalOpen && <AddClassModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
