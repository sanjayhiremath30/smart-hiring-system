"use client";

import StepWorkspace from "@/components/StepWorkspace";

export default function LLDStep() {
    return (
        <StepWorkspace
            step={5}
            title="Low Level Design"
            description="Component hierarchy, state management strategy, and utility function definitions."
        />
    );
}
