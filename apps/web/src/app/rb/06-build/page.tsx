"use client";

import StepWorkspace from "@/components/StepWorkspace";

export default function BuildStep() {
    return (
        <StepWorkspace
            step={6}
            title="Core Build"
            description="The main development phase. Implementing the resume editor and AI generation capabilities."
        />
    );
}
