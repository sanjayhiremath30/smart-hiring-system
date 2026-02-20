"use client";

import Link from "next/link";

export default function SetupPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="glass-card p-8">
        <h1 className="text-2xl font-bold gradient-text mb-2">Fix: Register & Login</h1>
        <p className="text-amber-400/90 text-sm mb-6">
          The app needs a database. Choose one option below — then Register and Login will work.
        </p>

        <div className="space-y-6 text-gray-300">
          <section className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <h2 className="text-lg font-semibold text-white mb-2">Option 1: Docker (easiest if you have Docker)</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Open <strong>Docker Desktop</strong> and make sure it is running.</li>
              <li>Open PowerShell and run (copy all three lines):
                <pre className="mt-2 bg-black/30 p-3 rounded text-cyan-300 text-xs overflow-x-auto whitespace-pre">
{`cd c:\\Users\\Hp\\Desktop\\sanjays-job-portal
docker compose up -d
npx prisma migrate deploy`}
                </pre>
              </li>
              <li>Wait ~10 seconds, then start the app:
                <pre className="mt-2 bg-black/30 p-3 rounded text-sm overflow-x-auto">
                  cd apps\web{"\n"}npm run dev
                </pre>
              </li>
            </ol>
            <p className="text-green-400 text-sm mt-2">Then open the app and create your account.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Option 2: Free cloud database (no Docker)</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">neon.tech</a> and sign up (e.g. with Google).</li>
              <li>Create a new project and copy the <strong>connection string</strong>.</li>
              <li>Open the file <code className="bg-white/10 px-1 rounded">apps\web\.env</code> and replace the <code className="bg-white/10 px-1 rounded">DATABASE_URL=...</code> line with your Neon URL (in quotes).</li>
              <li>In PowerShell from the project folder run:
                <pre className="mt-2 bg-black/30 p-3 rounded text-sm overflow-x-auto">
                  cd c:\Users\Hp\Desktop\sanjays-job-portal{"\n"}
                  npx prisma migrate deploy{"\n"}
                  cd apps\web{"\n"}
                  npm run dev
                </pre>
              </li>
            </ol>
          </section>
        </div>

        <Link href="/register" className="inline-block mt-8 btn-primary">
          ← Back to Register
        </Link>
      </div>
    </div>
  );
}
