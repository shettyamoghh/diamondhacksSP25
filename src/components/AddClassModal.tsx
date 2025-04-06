"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AddClassModalProps {
  onClose: () => void;
}

export const AddClassModal: React.FC<AddClassModalProps> = ({ onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Blurred Background */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        {/* Modal Content */}
        <motion.div
          className="relative bg-black border border-gray-500 rounded-lg p-8 z-10 w-full max-w-md"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-2xl font-semibold mb-4">Add Class</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="className">
                Class Name
              </label>
              <input
                id="className"
                type="text"
                placeholder="Enter class name"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="professor">
                Professor
              </label>
              <input
                id="professor"
                type="text"
                placeholder="Enter professor name"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="session">
                Session
              </label>
              <select
                id="session"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="semester">
                Semester
              </label>
              <select
                id="semester"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none"
              >
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="syllabus">
                Upload Syllabus
              </label>
              <input
                id="syllabus"
                type="file"
                className="w-full file:py-2 file:px-4 file:border file:border-[#FF6B00] file:rounded file:bg-gray-800 file:text-[#FF6B00] file:hover:bg-gray-700 focus:outline-none"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#FF6B00] text-black hover:bg-orange-500 transition"
              >
                Add Class
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
