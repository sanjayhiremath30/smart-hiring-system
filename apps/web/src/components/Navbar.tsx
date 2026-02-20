"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[var(--border)]" style={{ transition: "border-color 150ms ease-in-out" }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black font-serif tracking-tight" style={{ color: "var(--accent)" }}>
            Likzz Smart Hiring
          </span>
        </Link>
        <div className="flex items-center gap-4 text-[13px] font-medium">
          <Link href="/" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
            Jobs
          </Link>
          <Link href="/features" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
            Features
          </Link>
          <Link href="/mock-test" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
            Mock Test
          </Link>
          <Link href="/placement/dashboard" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
            Placement Prep
          </Link>
          <Link href="/rb" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
            Resume Builder
          </Link>

          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors font-bold">
              Admin
            </Link>
          )}

          {session?.user ? (
            <div className="flex items-center gap-4 border-l pl-4 border-[var(--border)]">
              <Link href="/dashboard" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                Dashboard
              </Link>
              <Link href="/saved" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Saved</Link>
              <Link href="/settings" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Settings</Link>
              <Link href="/digest" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Digest</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="px-4 py-2 rounded-xl text-white text-xs font-black transition-all hover:opacity-90 shadow-sm" style={{ background: "var(--accent)" }}>
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/register" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                Register
              </Link>
              <Link href="/login" className="px-5 py-2 rounded-xl text-white text-xs font-black transition-all hover:opacity-90 shadow-md" style={{ background: "var(--accent)" }}>
                LOGIN
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}