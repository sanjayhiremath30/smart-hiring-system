"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Code2,
    ClipboardCheck,
    Library,
    UserCircle,
    User,
    LogOut,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { title: "Dashboard", href: "/placement/dashboard", icon: LayoutDashboard },
    { title: "Practice", href: "/placement/practice", icon: Code2 },
    { title: "Assessments", href: "/placement/assessments", icon: ClipboardCheck },
    { title: "Resources", href: "/placement/resources", icon: Library },
    { title: "Profile", href: "/placement/profile", icon: UserCircle },
];

export default function PlacementLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Don't show shell on landing page
    if (pathname === "/placement") {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#020617]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-[#0f172a] flex flex-col">
                <div className="p-6">
                    <Link href="/placement" className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                            P
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                            Placement Prep
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-blue-600/10 text-blue-400"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                                )}
                            >
                                <div className="flex items-center">
                                    <item.icon size={20} className={cn("mr-3", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                                    {item.title}
                                </div>
                                {isActive && <ChevronRight size={14} className="text-blue-500/50" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 rounded-xl transition-all">
                        <LogOut size={20} className="mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
                    <h2 className="text-sm font-medium text-slate-400">
                        {navItems.find(i => pathname === i.href)?.title || "Platform"}
                    </h2>

                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-end mr-2">
                            <span className="text-sm font-bold text-slate-100">John Doe</span>
                            <span className="text-xs text-slate-500 uppercase tracking-tighter">Student</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                            <User size={24} />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
