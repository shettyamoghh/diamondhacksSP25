"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Topic {
  id: number;
  title: string;
}

interface RoadmapStep {
  id: number;
  roadmap_id: number;
  step_name: string;
  step_order: number;
  due_date: string | null;
  resource: string | null;  // <-- Add this so we can show resource links
}

export default function ClassDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id;

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([]);
  const [examDate, setExamDate] = useState("");
  const [filesText, setFilesText] = useState("");
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classId) {
      fetchData();
    }
  }, [classId]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      // 1) Fetch topics
      const topicsRes = await fetch(
        `http://localhost:3000/classes/${classId}/topics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!topicsRes.ok) throw new Error("Failed to fetch topics");
      const topicsData = await topicsRes.json();

      // 2) Fetch existing roadmap
      const roadmapRes = await fetch(`http://localhost:3000/roadmaps/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let stepsData: RoadmapStep[] = [];
      if (roadmapRes.ok) {
        const roadmapJson = await roadmapRes.json();
        // Expecting { steps: [...] }
        stepsData = roadmapJson.steps || [];
      } else if (roadmapRes.status !== 404) {
        // Some other error
        throw new Error("Failed to fetch roadmap");
      }

      setTopics(topicsData);
      setRoadmapSteps(stepsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (id: number) => {
    setSelectedTopicIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleFileChange = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    let combinedText = "";
    let filesRemaining = fileList.length;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === "string") {
          combinedText += `\n--- File: ${file.name} ---\n${text}\n`;
        }
        filesRemaining--;

        if (filesRemaining === 0) {
          setFilesText((prev) => prev + combinedText);
        }
      };
      reader.readAsText(file);
    }
  };

  const generateRoadmap = async () => {
    if (!examDate || selectedTopicIds.length === 0) {
      alert("Please choose an exam date & at least one topic.");
      return;
    }

    try {
      const token = localStorage.getItem("token") || "";
      const body = {
        class_id: Number(classId),
        end_date: examDate,
        selectedTopicIds,
        extra_files_text: filesText,
      };

      const res = await fetch("http://localhost:3000/roadmaps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create roadmap");
      }
      const result = await res.json();
      alert("Roadmap created!");

      // Update local steps to display the newly created roadmap
      setRoadmapSteps(result.steps || []);
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Class {classId} - Roadmap
        </h1>

        {roadmapSteps.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Existing Roadmap Steps
            </h2>
            {roadmapSteps.map((step) => (
              <div
                key={step.id}
                className="mb-2 border border-gray-700 rounded p-2"
              >
                <p className="font-semibold">Step #{step.step_order}</p>
                <p>Title: {step.step_name}</p>
                {step.due_date && (
                  <p>Due Date: {new Date(step.due_date).toLocaleDateString()}</p>
                )}
                {/* Display the resource link if present */}
                {step.resource && (
                  <p>
                    Resource:{" "}
                    <a
                      href={step.resource}
                      target="_blank"
                      rel="noreferrer"
                      className="underline text-blue-400 hover:text-blue-200"
                    >
                      {step.resource}
                    </a>
                  </p>
                )}
              </div>
            ))}

            <p className="mt-4 text-center font-medium">
              A roadmap already exists. No further generation required.
            </p>
          </div>
        ) : (
          <>
            {/* Topics Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Select Topics</h2>
              {topics.map((topic) => {
                const lines = topic.title.split("\n");
                let firstLine = lines[0];
                firstLine = firstLine.replace(
                  /^(\d+\.\s+)?Learning Objective:\s*/i,
                  ""
                );
                return (
                  <div key={topic.id} className="mb-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedTopicIds.includes(topic.id)}
                        onChange={() => toggleTopic(topic.id)}
                      />
                      {firstLine}
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Exam Date */}
            <div className="mb-6">
              <label className="block mb-1 font-medium">Exam Date:</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="bg-gray-800 text-white p-2 rounded w-full"
              />
            </div>

            {/* Additional Lectures/Notes */}
            <div className="mb-6">
              <label className="block mb-1 font-medium">
                Additional Lectures/Notes (Optional):
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => handleFileChange(e.target.files)}
                className="bg-gray-800 text-white p-2 rounded w-full"
              />
            </div>

            {/* Generate Roadmap Button */}
            <div className="text-center">
              <button
                onClick={generateRoadmap}
                className="bg-[#FF6B00] px-4 py-2 rounded text-black font-semibold hover:bg-orange-500 transition"
              >
                Generate Roadmap
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
