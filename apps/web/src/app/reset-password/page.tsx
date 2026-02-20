"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!token) {
      setError("Invalid reset link");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        setLoading(false);
        return;
      }
      setMessage("Password updated! You can now login.");
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  }

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-card p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold gradient-text mb-4">Invalid Link</h1>
          <p className="text-gray-400 mb-6">This reset link is invalid or has expired.</p>
          <Link href="/forgot-password" className="btn-primary inline-block">
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold gradient-text mb-2">Reset Password</h1>
        <p className="text-gray-400 mb-8">Enter your new password</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/20 text-green-400 text-sm">
            {message}
            <Link href="/login" className="block mt-2 text-cyan-400 underline">Go to Login</Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
            minLength={6}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="input-field"
            required
            minLength={6}
          />
          <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50">
            {loading ? "Updating..." : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><div className="glass-card p-8 animate-pulse w-full max-w-md h-64" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
