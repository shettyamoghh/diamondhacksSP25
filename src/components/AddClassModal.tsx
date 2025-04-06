"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface NewClassData {
  className: string;
  professor: string;
  session: string;
  semester: string;
  syllabusFile?: File;
}

interface AddClassModalProps {
  onClose: () => void;
  onSubmit: (data: NewClassData) => void;
}

export const AddClassModal: React.FC<AddClassModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [className, setClassName] = useState("");
  const [professor, setProfessor] = useState("");
  const [session, setSession] = useState("A");
  const [semester, setSemester] = useState("Fall");
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    className?: string;
    professor?: string;
  }>({});

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSyllabusFile(e.target.files[0]);
      setFileUploadSuccess(true);
    }
  };

  const validate = (): boolean => {
    let valid = true;
    const newErrors: { className?: string; professor?: string } = {};

    // Format the className to uppercase for the letters.
    const formattedClassName = className.toUpperCase();
    if (!/^[A-Z]{3} \d{3}$/.test(formattedClassName)) {
      newErrors.className = "Class name must be in format ABC 123.";
      valid = false;
    }

    // Validate professor name: at least two words, each longer than 2 characters.
    const professorWords = professor.trim().split(/\s+/);
    if (
      professorWords.length < 2 ||
      professorWords.some((word) => word.length < 3)
    ) {
      newErrors.professor =
        "Professor name must be at least two words, each longer than 2 characters.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formattedClassName =
      className.slice(0, 3).toUpperCase() + className.slice(3);
    setClassName(formattedClassName);
    if (validate()) {
      onSubmit({
        className: formattedClassName,
        professor,
        session,
        semester,
        syllabusFile: syllabusFile || undefined,
      });
      onClose();
    }
  };

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
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="className">
                Class Name
              </label>
              <input
                id="className"
                type="text"
                placeholder="ABC 123"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none"
              />
              {errors.className && (
                <p className="text-red-500 text-sm mt-1">{errors.className}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="professor">
                Professor Name
              </label>
              <input
                id="professor"
                type="text"
                placeholder="First Last"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none"
              />
              {errors.professor && (
                <p className="text-red-500 text-sm mt-1">{errors.professor}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="session">
                Session
              </label>
              <select
                id="session"
                value={session}
                onChange={(e) => setSession(e.target.value)}
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
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
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
              <label className="block">
                <span className="cursor-pointer inline-block px-4 py-2 border border-[#FF6B00] rounded bg-gray-800 text-[#FF6B00] hover:bg-gray-700 transition">
                  {fileUploadSuccess ? "Upload Successful" : "Choose File"}
                </span>
                <input
                  id="syllabus"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
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
