"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { AddClassModal, NewClassData } from "@/components/AddClassModal";

interface ClassData {
  id: string;
  className: string;
  professor: string;
  session: string;
  semester: string;
  progress: number;
  roadmapCreated: boolean;
  syllabusUploaded: boolean;
}

export default function Dashboard() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // States for syncing with Canvas
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Opens the "Add Class" modal (existing logic)
  const handleAddClassClick = () => {
    setModalOpen(true);
  };

  // Called when the Add Class form is submitted successfully (existing logic)
  const handleAddClass = (data: NewClassData) => {
    const newClass: ClassData = {
      id: Date.now().toString(),
      className: data.className,
      professor: data.professor,
      session: data.session,
      semester: data.semester,
      progress: 0,
      roadmapCreated: false,
      syllabusUploaded: !!data.syllabusFile,
    };
    setClasses((prev) => [...prev, newClass]);
  };

  // For testing: simulate progress update on a class
  const simulateProgress = (id: string) => {
    setClasses((prev) =>
        prev.map((cls) =>
            cls.id === id
                ? {
                  ...cls,
                  progress: Math.min(cls.progress + 10, 100),
                  roadmapCreated: true,
                }
                : cls
        )
    );
  };

  // --------------- NEW: Sync with Canvas ---------------

  const syncWithCanvas = async () => {
    try {
      setSyncError(null);
      setSyncLoading(true);

      const resp = await fetch("/api/canvas/courses");
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || "Unknown error");
      }

      const canvasCourses = await resp.json();
      console.log("Canvas Courses:", canvasCourses);

      // 1) Filter for courses that have both "2025" and "spring" in the name
      const filtered = canvasCourses.filter((course: any) => {
        const nameLower = (course.name || "").toLowerCase();
        return nameLower.includes("2025") && nameLower.includes("spring");
      });
      console.log("Filtered Courses:", filtered);

      // 2) Map them to ClassData format
      const mapped = filtered.map((course: any) => {
        // Example: "2025SpringC-T-CSE330-16620"
        // We'll split on "-" -> nameParts[0] = "2025SpringC", nameParts[1]="T", nameParts[2]="CSE330", etc.
        const nameParts = (course.name || "").split("-");
        let className = "Unknown Class";
        let session = "A";
        let semester = "Spring"; // because we already know "Spring" is in the name
        let professor = "N/A";

        // If teachers are present, use the first teacher's name
        if (course.teachers && course.teachers.length > 0) {
          // e.g. "Jane Smith"
          professor = course.teachers[0].display_name || "N/A";
        }

        // Parse session/class code from nameParts
        // nameParts[0] might be "2025SpringC"
        // nameParts[2] might be "CSE330"
        if (nameParts.length >= 3) {
          className = nameParts[2].trim(); // e.g. "CSE330"

          const possibleSession = nameParts[0].trim();
          // If the last char is A/B/C, interpret as session
          const lastChar = possibleSession.slice(-1).toUpperCase(); // e.g. "C"
          if (["A", "B", "C"].includes(lastChar)) {
            session = lastChar;
          }
        }

        return {
          id: course.id.toString(),
          className,
          professor,
          session,
          semester,
          progress: 0,
          roadmapCreated: false,
          syllabusUploaded: false,
        } as ClassData;
      });

      console.log("Mapped Courses:", mapped);

      // 3) Update state with mapped courses so they appear in your UI
      setClasses(mapped);
    } catch (err: any) {
      console.error("Canvas sync error:", err);
      setSyncError(err.message);
    } finally {
      setSyncLoading(false);
    }
  };

  // Determine how many placeholder cards to show
  const filledCount = classes.length;
  const remainder = filledCount % 4;
  const placeholdersCount =
      filledCount === 0 ? 4 : remainder === 0 ? 4 : 4 - remainder;

  // Create a combined array: filled classes first, then placeholder nulls.
  const displayCards = [...classes, ...Array(placeholdersCount).fill(null)];

  return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        {/* Header with Radial Dots Background */}
        <div className="relative mb-12">
          <div className="relative h-[20rem] flex flex-col items-center justify-center">
            {/* Dots background layer */}
            <div className="absolute inset-0 [background-size:20px_20px] [background-image:radial-gradient(#d4d4d4_1px,transparent_1px)] dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"></div>
            {/* Faded radial gradient overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
            {/* Header content */}
            <div className="relative z-20 text-center">
              <motion.h2
                  className="text-5xl font-semibold mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
              >
                Your Classes
              </motion.h2>
              <motion.p
                  className="text-gray-300 mb-4 text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
              >
                Manage your classes and create personalized study roadmaps.
              </motion.p>

              {/* "Sync with Canvas" button calls syncWithCanvas */}
              <motion.button
                  onClick={syncWithCanvas}
                  className="bg-white text-black mt-2 px-6 py-2 rounded hover:bg-gray-200 transition"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
              >
                {syncLoading ? "Syncing..." : "Sync with Canvas"}
              </motion.button>

              {/* If there's an error syncing with Canvas, display it */}
              {syncError && (
                  <motion.p
                      className="text-red-500 mt-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                  >
                    {syncError}
                  </motion.p>
              )}
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <main className="container mx-auto px-4 pb-8 text-center">
          <motion.section
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
          >
            {displayCards.map((card, index) => {
              if (index < classes.length) {
                const cls = classes[index];
                // Format professor name to e.g. "J. Smith" if possible
                const professorFormatted = (() => {
                  const parts = cls.professor.trim().split(/\s+/);
                  if (parts.length >= 2) {
                    return `${parts[0].charAt(0).toUpperCase()}. ${parts[1]
                        .charAt(0)
                        .toUpperCase()}${parts[1].slice(1).toLowerCase()}`;
                  }
                  return cls.professor;
                })();

                return (
                    <div
                        key={cls.id}
                        className="bg-black text-white rounded-lg p-4 flex flex-col h-[24rem] border-2 border-[#FF6B00] shadow-[0_0_10px_#FF6B00]"
                    >
                      <div>
                        <h3 className="font-extrabold text-4xl mt-5">
                          {cls.className}
                        </h3>
                        <p className="mt-1 text-xl">{professorFormatted}</p>
                        <p className="text-md mt-1">
                          Session {cls.session}, {cls.semester} 2025
                        </p>
                        <hr className="mt-4 border-white" />
                      </div>
                      <div className="flex flex-col flex-grow items-center justify-center mt-3">
                        <div className="relative w-32 h-32">
                          <svg className="w-32 h-32" viewBox="0 0 56 56">
                            <path
                                className="text-gray-300"
                                strokeWidth="5"
                                stroke="currentColor"
                                fill="none"
                                d="M28 4
                             a 24 24 0 1 1 0 48
                             a 24 24 0 1 1 0 -48"
                            />
                            <path
                                className="text-[#FF6B00]"
                                strokeWidth="6"
                                strokeDasharray={`${
                                    (cls.progress / 100) * 150.72
                                } 150.72`}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M28 4
                             a 24 24 0 1 1 0 48
                             a 24 24 0 1 1 0 -48"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold">
                          {cls.progress}%
                        </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button
                            onClick={() => simulateProgress(cls.id)}
                            className="w-full bg-[#FF6B00] text-white px-4 py-2 rounded hover:bg-orange-500 transition mt-4"
                        >
                          {cls.roadmapCreated ? "View Roadmap" : "Generate Roadmap"}
                        </button>
                      </div>
                    </div>
                );
              } else if (index === classes.length) {
                // The first placeholder is an "Add Class" button
                return (
                    <div
                        key={`placeholder-${index}`}
                        className="border-2 border-dashed border-gray-500 rounded-lg h-[24rem] flex items-center justify-center bg-black"
                    >
                      <button
                          onClick={handleAddClassClick}
                          className="flex flex-col items-center cursor-pointer"
                      >
                        <div className="text-5xl font-bold text-[#FF6B00]">+</div>
                        <span className="mt-2 text-[#FF6B00] text-xl">
                      Add Class
                    </span>
                      </button>
                    </div>
                );
              } else {
                // Remaining placeholders are just "Empty"
                return (
                    <div
                        key={`placeholder-${index}`}
                        className="border-2 border-dashed border-gray-500 rounded-lg h-[24rem] flex items-center justify-center bg-black"
                    >
                      <span className="text-gray-500 text-3xl">Empty</span>
                    </div>
                );
              }
            })}
          </motion.section>
        </main>
        {modalOpen && (
            <AddClassModal
                onClose={() => setModalOpen(false)}
                onSubmit={handleAddClass}
            />
        )}
      </div>
  );
}
