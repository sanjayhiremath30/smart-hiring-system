"use client";

import StepWorkspace from "@/components/StepWorkspace";

export default function ShipStep() {
    return (
        <StepWorkspace
            step={8}
            title="Deployment"
            description="Configuring CI/CD, setting up production environment, and shipping the app."
        />
    );
}
