export type ResumeTemplate = 'classic' | 'modern' | 'minimal';
export type ResumeColor = 'teal' | 'navy' | 'burgundy' | 'forest' | 'charcoal';

export interface Education {
    id: string;
    school: string;
    degree: string;
    year: string;
    location: string;
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    period: string;
    description: string; // Markdown/Bullet points
}

export interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    liveUrl?: string;
    githubUrl?: string;
}

export interface SkillGroup {
    technical: string[];
    soft: string[];
    tools: string[];
}

export interface ResumeData {
    personalInfo: {
        name: string;
        email: string;
        phone: string;
        location: string;
        summary: string;
        github?: string;
        linkedin?: string;
    };
    education: Education[];
    experience: Experience[];
    projects: Project[];
    skills: SkillGroup;
    settings: {
        template: ResumeTemplate;
        color: ResumeColor;
    };
}

export const DEFAULT_RESUME_DATA: ResumeData = {
    personalInfo: {
        name: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
    },
    education: [],
    experience: [],
    projects: [],
    skills: {
        technical: [],
        soft: [],
        tools: [],
    },
    settings: {
        template: 'classic',
        color: 'teal',
    },
};

export const COLOR_MAP: Record<ResumeColor, string> = {
    teal: 'hsl(168, 60%, 40%)',
    navy: 'hsl(220, 60%, 35%)',
    burgundy: 'hsl(345, 60%, 35%)',
    forest: 'hsl(150, 50%, 30%)',
    charcoal: 'hsl(0, 0%, 25%)',
};
