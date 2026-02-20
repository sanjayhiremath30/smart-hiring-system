"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ALL_LOCATIONS } from "@/lib/constants";

type Job = {
  id: string;
  title: string;
  description: string;
  status: string;
  company?: string;
  location?: string;
  state?: string;
  salary?: string;
  skills?: string[];
};

export default function Home() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">

      {/* HERO */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-cyan-400">Your Career</span>
          <br />
          Starts Here
        </h1>

        <p className="text-gray-300 mb-8">
          Discover opportunities across India. Filter by state and skills.
        </p>

        {!session && (
          <Link
            href="/register"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-xl font-semibold"
          >
            Get Started Free
          </Link>
        )}
      </section>

      {/* FILTERS */}
      <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {/* State Dropdown */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              State / Location
            </label>

            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-2 focus:ring-2 focus:ring-cyan-400 appearance-none"
              style={{ colorScheme: "dark" }}
            >
              <option value="">All states</option>
              {ALL_LOCATIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Skills
            </label>

            <input
              type="text"
              placeholder="e.g. React, Node.js"
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-2 focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setStateFilter("");
                setSkillsFilter("");
              }}
              className="text-cyan-400 hover:text-cyan-300"
            >
              Clear filters
            </button>
          </div>
        </div>
      </section>

      {/* JOBS */}
      <section>
        <h2 className="text-2xl font-bold mb-8">Featured Jobs</h2>

        {loading && <p>Loading...</p>}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-lg font-semibold text-cyan-400">
                {job.title}
              </h3>

              <p className="text-gray-300 text-sm mb-3">
                {job.description}
              </p>

              <button className="bg-gradient-to-r from-cyan-500 to-blue-500 w-full py-2 rounded-xl">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}