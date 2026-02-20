"use client";

import StepWorkspace from "@/components/StepWorkspace";

export default function ProblemStep() {
    return (
        <StepWorkspace
            step={1}
            title="Define the Problem"
            description="Start by clearly articulating the problem your AI Resume Builder solves. Who are the users? What is their biggest pain point?"
        />
    );
}
