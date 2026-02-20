import { ResumeData, SkillGroup } from "./types";

export const ACTION_VERBS = [
    'built', 'led', 'designed', 'improved', 'implemented',
    'developed', 'created', 'optimized', 'automated',
    'managed', 'coordinated', 'launched', 'delivered'
];

export interface Suggestion {
    message: string;
    points: number;
}

export function calculateATSScore(data: ResumeData): { score: number; suggestions: Suggestion[] } {
    let score = 0;
    const suggestions: Suggestion[] = [];

    // Personal Info (max 40)
    if (data.personalInfo.name.trim()) score += 10;
    else suggestions.push({ message: "Add your full name (+10)", points: 10 });

    if (data.personalInfo.email.trim()) score += 10;
    else suggestions.push({ message: "Add a professional email (+10)", points: 10 });

    if (data.personalInfo.phone.trim()) score += 5;
    else suggestions.push({ message: "Add your phone number (+5)", points: 5 });

    if (data.personalInfo.github?.trim() || data.personalInfo.linkedin?.trim()) score += 5;
    else suggestions.push({ message: "Add LinkedIn or GitHub link (+5)", points: 5 });

    // Summary (max 25)
    const summary = data.personalInfo.summary.trim();
    const summaryLength = summary.length;
    const summaryWords = summary.split(/\s+/).filter(Boolean).length;

    if (summaryLength > 50) {
        score += 10;
        if (summaryWords >= 40 && summaryWords <= 120) {
            score += 5; // Extra for optimal length
        }
    } else {
        suggestions.push({ message: "Write a summary of at least 50 chars (+10)", points: 10 });
    }

    const hasActionVerb = ACTION_VERBS.some(v => summary.toLowerCase().includes(v));
    if (hasActionVerb) score += 10;
    else if (summaryLength > 0) suggestions.push({ message: "Use action verbs in your summary (+10)", points: 10 });

    // Experience (max 15)
    if (data.experience.length > 0) {
        const hasBullets = data.experience.some(e => e.description.includes('-') || e.description.includes('•'));
        if (hasBullets) score += 15;
        else suggestions.push({ message: "Add bullet points to your experience (+15)", points: 15 });
    } else {
        suggestions.push({ message: "Add professional experience or internships (+15)", points: 15 });
    }

    // Education (max 10)
    if (data.education.length > 0) score += 10;
    else suggestions.push({ message: "Add your education (+10)", points: 10 });

    // Skills (max 10)
    const totalSkills = data.skills.technical.length + data.skills.soft.length + data.skills.tools.length;
    if (totalSkills >= 5) {
        score += 10;
    } else {
        suggestions.push({ message: "Add at least 5 skills (+10)", points: 10 });
    }

    // Projects (max 10)
    if (data.projects.length > 0) score += 10;
    else suggestions.push({ message: "Add at least one project (+10)", points: 10 });

    // Measurable Impact (max 15 - Bonus)
    const allContent = [
        ...data.experience.map(e => e.description),
        ...data.projects.map(p => p.description)
    ].join(" ");

    const hasNumbers = /[\d]+[%k+]|million|billion|improved|increased|decreased|reduced/i.test(allContent);
    if (hasNumbers) score += 15;
    else if (data.experience.length > 0 || data.projects.length > 0) {
        suggestions.push({ message: "Show measurable impact with numbers (+15)", points: 15 });
    }

    return {
        score: Math.min(score, 100),
        suggestions: suggestions.sort((a, b) => b.points - a.points).slice(0, 3)
    };
}

export const SUGGESTED_SKILLS = {
    technical: ["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"],
    soft: ["Team Leadership", "Problem Solving", "Communication", "Adaptability"],
    tools: ["Git", "Docker", "AWS", "Jira", "Vercel"]
};

export const SAMPLE_DATA: ResumeData = {
    personalInfo: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 000-0000",
        location: "New York, NY",
        summary: "Dedicated Software Engineer with 4+ years of experience in building scalable web applications. Led the development of a microservices-based architecture that improved system efficiency by 40%. Expertise in React, Node.js, and cloud deployments.",
        github: "github.com/johndoe",
        linkedin: "linkedin.com/in/johndoe"
    },
    education: [{
        id: "1",
        school: "University of Technology",
        degree: "B.S. in Computer Science",
        year: "2018 - 2022",
        location: "San Francisco, CA"
    }],
    experience: [{
        id: "1",
        company: "Tech Solutions Inc.",
        role: "Senior Frontend Developer",
        period: "2022 - Present",
        description: "- Led a team of 5 developers to ship a new dashboard.\n- Optimized React components reducing bundle size by 30%.\n- Automated CI/CD pipelines using GitHub Actions."
    }],
    projects: [{
        id: "1",
        title: "AI Resume Scanner",
        description: "Built a deterministic scoring engine for resumes using keyword extraction and pattern matching.",
        techStack: ["Next.js", "TypeScript", "Tailwind"],
        githubUrl: "github.com/johndoe/scanner"
    }],
    skills: {
        technical: ["React", "TypeScript", "Next.js", "Node.js"],
        soft: ["Leadership", "Problem Solving"],
        tools: ["Git", "Docker", "AWS"]
    },
    settings: {
        template: 'modern',
        color: 'teal'
    }
};
