"use client";

import { useState } from "react";
import { generateLessonPlan } from "./actions";
import { useRouter } from "next/navigation";
import { SparklesIcon, ArrowRightIcon } from "lucide-react";

export default function GeneratePage() {
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(45);
  const [additionalContext, setAdditionalContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await generateLessonPlan({
        subject,
        gradeLevel,
        topic,
        duration,
        additionalContext: additionalContext || undefined,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate");
      setLoading(false);
    }
  };

  const gradeLevels = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const subjects = [
    "Math",
    "Science",
    "English",
    "History",
    "Geography",
    "Art",
    "Music",
    "Physical Education",
    "Computer Science",
    "Foreign Language",
    "Other",
  ];

  return (
    <div>
      <div className="flex items-center mb-8">
        <SparklesIcon className="w-8 h-8 text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">AI Lesson Plan Generator</h1>
      </div>

      <div className="max-w-2xl">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-800">
            Describe your lesson and our AI will create a complete lesson plan with objectives, 
            materials, and activities. You can also upload curriculum documents for context-aware generation.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Level
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select grade</option>
                {gradeLevels.map((g) => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lesson Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., Introduction to Fractions, The Water Cycle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={15}
              max={180}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Context (optional)
            </label>
            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any specific requirements, student needs, or context..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="w-4 h-4 mr-2" />
                Generate Lesson Plan
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
