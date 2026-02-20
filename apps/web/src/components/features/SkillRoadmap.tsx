"use client";

import { useState } from "react";

const MOCK_ROADMAP: Record<string, { courses: string[]; youtube: string[]; problems: string[] }> = {
  react: {
    courses: ["React - The Complete Guide (Udemy)", "Frontend Masters - React"],
    youtube: ["React 18 Tutorial (Codevolution)", "Next.js 14 (Web Dev Simplified)"],
    problems: ["Build a todo app", "Clone Twitter feed", "Dashboard with charts"],
  },
  node: {
    courses: ["Node.js Bootcamp (Udemy)", "Backend Master (Educative)"],
    youtube: ["Node.js Full Course (freeCodeCamp)", "REST APIs with Node"],
    problems: ["REST API for blog", "Auth with JWT", "File upload API"],
  },
  python: {
    courses: ["Python for Everybody", "ML with Python (Coursera)"],
    youtube: ["Python Full Course", "Machine Learning (StatQuest)"],
    problems: ["Data pipeline script", "ML model on Kaggle", "Automation script"],
  },
};

export function SkillRoadmap() {
  const [skill, setSkill] = useState("react");
  const key = skill.toLowerCase().split(/[\s,]+/)[0] || "react";
  const data = MOCK_ROADMAP[key] || MOCK_ROADMAP.react;
  return (
    <div className="space-y-6">
      <p className="text-gray-400">Enter a skill you want to learn for a learning roadmap.</p>
      <input
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        placeholder="e.g. React, Node, Python"
        className="input-field max-w-md"
      />
      <div className="glass-card p-6 space-y-6">
        <div>
          <h4 className="text-white font-semibold mb-2">Courses</h4>
          <ul className="list-disc list-inside text-gray-400">
            {data.courses.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">YouTube</h4>
          <ul className="list-disc list-inside text-gray-400">
            {data.youtube.map((y, i) => (
              <li key={i}>{y}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Practice projects</h4>
          <ul className="list-disc list-inside text-gray-400">
            {data.problems.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
