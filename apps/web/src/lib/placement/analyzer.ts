export type SkillCategory = 'Core CS' | 'Languages' | 'Web' | 'Data' | 'Cloud/DevOps' | 'Testing';

export interface ExtractedSkill {
    name: string;
    category: SkillCategory;
}

export const SKILL_MAP: Record<SkillCategory, string[]> = {
    'Core CS': ['DSA', 'OOP', 'DBMS', 'OS', 'Networks'],
    'Languages': ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go'],
    'Web': ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL'],
    'Data': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
    'Cloud/DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    'Testing': ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest'],
};

export function extractSkills(jdText: string): ExtractedSkill[] {
    const extracted: ExtractedSkill[] = [];
    const text = jdText.toLowerCase();

    Object.entries(SKILL_MAP).forEach(([category, skills]) => {
        skills.forEach(skill => {
            // Escape special characters for regex (e.g., C++)
            const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
            if (regex.test(text)) {
                extracted.push({ name: skill, category: category as SkillCategory });
            }
        });
    });

    return extracted;
}

export function calculateReadinessScore(jdText: string, companyName?: string, roleName?: string, detectedCategoriesCount = 0): number {
    let score = 35;

    // +5 per detected category present (max 30)
    score += Math.min(detectedCategoriesCount * 5, 30);

    // +10 if company name provided
    if (companyName?.trim()) score += 10;

    // +10 if role provided
    if (roleName?.trim()) score += 10;

    // +10 if JD length > 800 chars
    if (jdText.length > 800) score += 10;

    return Math.min(score, 100);
}

export function generate7DayPlan(skills: ExtractedSkill[]): string[] {
    const plan = [
        "Day 1–2: Basics + core CS concepts",
        "Day 3–4: DSA + coding practice",
        "Day 5: Project overview + resume alignment",
        "Day 6: Mock interview questions",
        "Day 7: Full revision + focusing on weak areas",
    ];

    // Adaptation: if frontend skills present
    if (skills.some(s => ['React', 'Next.js', 'JavaScript'].includes(s.name))) {
        plan[2] = "Day 5: Project + Frontend/React deep dive + resume alignment";
    }

    return plan;
}

export function generateQuestions(skills: ExtractedSkill[]): string[] {
    const questions: string[] = [];

    skills.forEach(skill => {
        if (skill.name === 'SQL') questions.push("Explain indexing and when it helps optimization.");
        if (skill.name === 'React') questions.push("Explain state management options in React and when to use each.");
        if (skill.name === 'DSA') questions.push("How would you optimize search in sorted vs unsorted data?");
        if (skill.name === 'Java') questions.push("Explain the difference between HashMap and ConcurrentHashMap.");
        if (skill.name === 'Node.js') questions.push("How does the event loop work in Node.js?");
        if (skill.name === 'Docker') questions.push("What is the difference between an image and a container?");
    });

    // Add generic if too few
    while (questions.length < 5) {
        questions.push("Explain a challenging technical project you worked on recently.");
        questions.push("How do you handle conflict in a technical team environment?");
        if (questions.length >= 10) break;
    }

    return questions.slice(0, 10);
}
