"use client";

import ResumeAppLayout from "./ResumeAppLayout";
import TrackLayout from "./TrackLayout";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ResumeAppLayout>
            <TrackLayoutWrapper>{children}</TrackLayoutWrapper>
        </ResumeAppLayout>
    );
}

// Client wrapper to check path for track layout
function TrackLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isTrack = pathname.match(/\/rb\/0\d+/) || pathname === '/rb/proof';

    if (isTrack) {
        return <TrackLayout>{children}</TrackLayout>;
    }

    return <>{children}</>;
}
