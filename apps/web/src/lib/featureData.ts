// Mock data for features - realistic structure for 100% accurate-looking outputs

export const TRENDING_SKILLS = [
  { skill: "React / Next.js", demand: 98, growth: "+12%", salary: "8–18 LPA" },
  { skill: "Node.js / Backend", demand: 95, growth: "+10%", salary: "7–16 LPA" },
  { skill: "Python / ML", demand: 94, growth: "+15%", salary: "10–25 LPA" },
  { skill: "AWS / Cloud", demand: 92, growth: "+18%", salary: "9–22 LPA" },
  { skill: "Data Engineering", demand: 90, growth: "+20%", salary: "12–28 LPA" },
  { skill: "DevOps / Kubernetes", demand: 88, growth: "+14%", salary: "9–20 LPA" },
  { skill: "System Design", demand: 85, growth: "+8%", salary: "—" },
  { skill: "DSA", demand: 82, growth: "+5%", salary: "—" },
];

export const SALARY_BY_ROLE: Record<string, string> = {
  "Frontend Developer": "6–18 LPA",
  "Backend Developer": "7–20 LPA",
  "Full Stack": "8–22 LPA",
  "ML Engineer": "12–35 LPA",
  "Data Scientist": "10–28 LPA",
  "DevOps Engineer": "9–24 LPA",
  "SDE 1": "5–12 LPA",
  "SDE 2": "12–25 LPA",
};

export const RECRUITER_PERSONAS = {
  STARTUP: {
    name: "Startup Recruiter",
    mindset: "Looks for ownership, speed, and culture fit. Less formal, more practical.",
    questions: [
      "Tell me about a feature you shipped end-to-end in a short time.",
      "How do you handle ambiguity when requirements keep changing?",
      "Why do you want to join a startup instead of an MNC?",
      "Describe a time you had to learn something new in a week and ship it.",
    ],
    evalStyle: "Values initiative and hustle over perfect process.",
  },
  MNC: {
    name: "MNC Recruiter",
    mindset: "Focus on scale, process, and long-term impact. Structured rounds.",
    questions: [
      "Describe a system you designed that scaled to millions of users.",
      "How do you ensure code quality in a large codebase?",
      "Tell me about a cross-team project and how you aligned stakeholders.",
      "Where do you see yourself in 5 years?",
    ],
    evalStyle: "Values clarity, structure, and alignment with company level.",
  },
  PRODUCT: {
    name: "Product Company Recruiter",
    mindset: "Cares about product sense, user impact, and technical depth.",
    questions: [
      "How would you improve the product we just discussed?",
      "Describe a technical decision that directly improved user metrics.",
      "How do you balance tech debt with feature delivery?",
      "Tell me about a time you said no to a feature and why.",
    ],
    evalStyle: "Values product thinking and measurable impact.",
  },
};

export const SKILLS_DYING_2028 = [
  { skill: "jQuery", relevance: 12, reason: "Replaced by modern frameworks" },
  { skill: "PHP (legacy)", relevance: 25, reason: "Decline in new projects" },
  { skill: "Flash", relevance: 5, reason: "Obsolete" },
  { skill: "VB6 / Classic ASP", relevance: 8, reason: "Legacy only" },
];

export const ROLES_GROWING_2028 = [
  { role: "AI / ML Engineer", growth: "+35%", demand: "Very High" },
  { role: "Data Engineer", growth: "+28%", demand: "Very High" },
  { role: "DevSecOps", growth: "+22%", demand: "High" },
  { role: "Platform Engineer", growth: "+20%", demand: "High" },
];

export const COUNTRY_DEMAND = [
  { country: "India", skill: "Full Stack / React", trend: "Rising" },
  { country: "USA", skill: "ML / AI", trend: "Rising" },
  { country: "Germany", skill: "Backend / Java", trend: "Stable" },
];
