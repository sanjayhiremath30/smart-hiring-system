"use client";

import StepWorkspace from "@/components/StepWorkspace";

export default function TestStep() {
    return (
        <StepWorkspace
            step={7}
            title="Testing & QA"
            description="Unit tests, integration tests, and manual verification of generated resumes."
        />
    );
}
