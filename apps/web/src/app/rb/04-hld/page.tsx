"use client";

import StepWorkspace from "@/components/StepWorkspace";

export default function HLDStep() {
    return (
        <StepWorkspace
            step={4}
            title="High Level Design"
            description="Detailed module breakdown, API contracts, and database schema for the resume builder."
        />
    );
}
