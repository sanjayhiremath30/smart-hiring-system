"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setResetLink("");
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }
      setMessage(data.message || "Check your email for a reset link.");
      if (data.resetLink) setResetLink(data.resetLink);
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold gradient-text mb-2">Forgot Password</h1>
        <p className="text-gray-400 mb-8">Enter your email to receive a password reset link</p>

        {error && (
          <div className="mb-4 space-y-2">
            <div className="p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">
              {error}
            </div>
            {(error.includes("Database") || error.includes("not connected")) && (
              <Link
                href="/setup"
                className="block p-3 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-sm text-center"
              >
                📌 Setup guide: free database in 2 min
              </Link>
            )}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/20 text-green-400 text-sm">
            {message}
            {resetLink && (
              <p className="mt-2">
                <a href={resetLink} className="underline">Click here to reset your password</a>
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
