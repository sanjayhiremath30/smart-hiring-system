"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "ADMIN">("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      router.push("/login");
      router.refresh();
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="glass-card p-8 w-full max-w-md animate-fade-in">
        <h1 className="text-2xl font-bold gradient-text mb-2">Create Account</h1>
        <p className="text-slate-400 mb-8 font-medium">Join Likzz Smart Hiring</p>

        {error && (
          <div className="mb-4 space-y-2">
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm shadow-lg">
              {error}
            </div>
            {(error.includes("Database") || error.includes("not connected")) && (
              <Link
                href="/setup"
                className="block p-3 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-300 text-sm text-center font-bold"
              >
                📌 Click here: Setup guide (free cloud database in 2 min)
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
          <input
            type="email"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 characters) *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
            minLength={6}
          />
          <div>
            <label className="block text-sm text-slate-500 mb-2 font-black uppercase tracking-widest text-[10px]">I am a</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="STUDENT"
                  checked={role === "STUDENT"}
                  onChange={() => setRole("STUDENT")}
                  className="accent-blue-600"
                />
                <span className="text-sm text-slate-400 font-medium">Student / Job Seeker</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={role === "ADMIN"}
                  onChange={() => setRole("ADMIN")}
                  className="accent-blue-600"
                />
                <span className="text-sm text-slate-400 font-medium">Admin / Recruiter</span>
              </label>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500 text-sm font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
