"use client";

import StepWorkspace from "@/components/StepWorkspace";

export default function ArchitectureStep() {
    return (
        <StepWorkspace
            step={3}
            title="System Architecture"
            description="Design the high-level architecture. How will the AI agent, the frontend, and the database interact?"
        />
    );
}
