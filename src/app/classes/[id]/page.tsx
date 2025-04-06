"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";

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
  resource: string | null;
  bullet_points?: string[]; // We expect an array from the server
  eta?: string;
  topic_title?: string;
}

export default function ClassDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id;

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([]);
  const [examDate, setExamDate] = useState("");
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
      // Fetch topics
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

      // Fetch existing roadmap
      const roadmapRes = await fetch(
        `http://localhost:3000/roadmaps/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let stepsData: RoadmapStep[] = [];
      if (roadmapRes.ok) {
        const roadmapJson = await roadmapRes.json();
        // Expecting { steps: [...] }
        stepsData = roadmapJson.steps || [];
      } else if (roadmapRes.status !== 404) {
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
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Dashboard-style Navbar */}
      <Navbar />

      <div className="w-full max-w-3xl mt-10 px-6 self-center">
        <h1 className="text-5xl font-bold mb-3 text-center">
          Time to lock in.
        </h1>

        {roadmapSteps.length > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold mb-10 text-center">
              Here is your detailed study guide.
            </h2>
            <div className="space-y-4">
              {roadmapSteps.map((step) => (
                <div
                  key={step.id}
                  className="p-4 bg-[#111111] rounded shadow border border-[#FF6B00]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">
                      Step #{step.step_order}
                    </span>
                    {step.eta && (
                      <span className="bg-[#FF6B00] px-2 py-1 rounded text-sm">
                        ETA: {step.eta}
                      </span>
                    )}
                  </div>
                  <p className="text-lg">
                    <strong>{step.step_name}</strong>
                  </p>
                  {step.topic_title && (
                    <p className="italic text-gray-400">
                      Topic: {step.topic_title}
                    </p>
                  )}
                  {step.due_date && (
                    <p>
                      Due Date: {new Date(step.due_date).toLocaleDateString()}
                    </p>
                  )}
                  {step.resource && (
                    <p>
                      Resource:{" "}
                      <a
                        href={step.resource}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-[#FF6B00] hover:text-[#FFA040]"
                      >
                        {step.resource}
                      </a>
                    </p>
                  )}
                  {step.bullet_points && step.bullet_points.length > 0 && (
                    <ul className="list-disc list-inside mt-2">
                      {step.bullet_points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-6 text-center font-medium">
              A roadmap already exists. No further generation required.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-[#111111] p-6 rounded shadow mb-8 border border-[#FF6B00]">
              <h2 className="text-2xl font-semibold mb-4">Select Topics</h2>
              <div className="grid grid-cols-1 gap-2">
                {topics.map((topic) => {
                  const lines = topic.title.split("\n");
                  let firstLine = lines[0];
                  firstLine = firstLine.replace(
                    /^(\d+\.\s+)?Learning Objective:\s*/i,
                    ""
                  );
                  return (
                    <label
                      key={topic.id}
                      className="flex items-center space-x-2 p-2 bg-[#222222] rounded hover:bg-[#333333] transition"
                    >
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedTopicIds.includes(topic.id)}
                        onChange={() => toggleTopic(topic.id)}
                      />
                      <span>{firstLine}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#111111] p-6 rounded shadow mb-8 border border-[#FF6B00]">
              <label className="block mb-2 font-medium">Exam Date:</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full p-2 rounded bg-[#222222] text-white"
              />
            </div>

            <div className="text-center">
              <button
                onClick={generateRoadmap}
                className="bg-[#FF6B00] hover:bg-[#e65c00] text-white font-semibold py-2 px-6 rounded transition"
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
