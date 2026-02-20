export type JobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  mode: "Remote" | "Hybrid" | "Onsite";
  experience: "Fresher" | "0-1" | "1-3" | "3-5";
  skills: string[];
  source: "LinkedIn" | "Naukri" | "Indeed";
  postedDaysAgo: number;
  salaryRange: string;
  applyUrl: string;
  description: string;
};

const companies = [
  "Infosys", "TCS", "Wipro", "Accenture", "Capgemini", "Cognizant",
  "IBM", "Oracle", "SAP", "Dell",
  "Amazon", "Flipkart", "Swiggy", "Razorpay", "PhonePe", "Paytm",
  "Zoho", "Freshworks", "Juspay", "CRED",
  "HashedIn", "Thoughtworks", "Publicis Sapient", "LTI Mindtree",
  "Tech Mahindra", "HCL Technologies", "Larsen & Toubro Infotech",
  "Unacademy", "ShareChat", "Meesho", "DealShare", "Udaan",
];

const roles = [
  "SDE Intern", "Graduate Engineer Trainee", "Junior Backend Developer",
  "Frontend Intern", "QA Intern", "Data Analyst Intern",
  "Java Developer (0-1)", "Python Developer (Fresher)", "React Developer (1-3)",
  "Full Stack Developer (Fresher)", "DevOps Intern", "ML Engineer (0-1)",
  "Backend Developer (Fresher)", "Software Engineer Intern", "iOS Developer (0-1)",
];

const locations = ["Bangalore", "Hyderabad", "Chennai", "Pune", "Mumbai", "Gurgaon", "Noida", "Delhi", "Kolkata", "Kochi", "Ahmedabad", "Jaipur"];
const modes: ("Remote" | "Hybrid" | "Onsite")[] = ["Remote", "Hybrid", "Onsite"];
const experiences: ("Fresher" | "0-1" | "1-3" | "3-5")[] = ["Fresher", "0-1", "1-3", "3-5"];
const sources: ("LinkedIn" | "Naukri" | "Indeed")[] = ["LinkedIn", "Naukri", "Indeed"];
const salaryRanges = ["3–5 LPA", "6–10 LPA", "10–18 LPA", "₹15k–₹40k/month Internship", "₹20k–₹50k/month Internship", "4–7 LPA", "8–14 LPA"];

const skillPool = ["Java", "Python", "React", "Node.js", "JavaScript", "SQL", "MongoDB", "AWS", "Docker", "Kubernetes", "REST APIs", "Git", "Data Structures", "Algorithms", "HTML", "CSS", "TypeScript", "Redux", "Express.js", "Spring Boot", "Machine Learning", "TensorFlow", "Pandas", "Excel"];

const descTemplates = [
  "Join our engineering team to build scalable products. You will work on real-world problems and learn from experienced mentors. We value ownership and fast execution.",
  "We are looking for passionate developers to contribute to our platform. You will collaborate with product and design teams. Good communication and problem-solving skills required.",
  "Ideal for candidates who want to grow in a fast-paced environment. You will be involved in the full software development lifecycle. Prior internship or project experience is a plus.",
  "Work on cutting-edge technology stack. We offer mentorship and learning budget. Candidates with strong fundamentals and curiosity to learn will excel here.",
  "Join to build features used by millions. We focus on code quality, testing, and agile practices. Team culture is inclusive and collaborative.",
  "Great opportunity for freshers to work on backend systems, APIs, and databases. You will get exposure to cloud infrastructure and DevOps practices.",
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}
function pickN<T>(arr: T[], n: number, seed: number): T[] {
  const out: T[] = [];
  for (let k = 0; k < n; k++) out.push(arr[(seed + k) % arr.length]);
  return out;
}

function genId(i: number) {
  return `job-${String(i).padStart(3, "0")}`;
}

const lpaOnly = salaryRanges.filter((s) => s.includes("LPA"));
const internOnly = salaryRanges.filter((s) => s.includes("month"));

export const JOBS_DATASET: JobListing[] = Array.from({ length: 60 }, (_, i) => {
  const company = pick(companies, i);
  const title = pick(roles, i + 7);
  const skills = pickN(skillPool, 4 + (i % 4), i);
  const mode = pick(modes, i);
  const experience = pick(experiences, i + 3);
  const source = pick(sources, i);
  const salaryRange = title.toLowerCase().includes("intern") ? pick(internOnly, i) : pick(lpaOnly, i + 2);
  const location = pick(locations, i);
  const postedDaysAgo = i % 11;
  const desc = pick(descTemplates, i);
  return {
    id: genId(i + 1),
    title,
    company,
    location,
    mode,
    experience,
    skills,
    source,
    postedDaysAgo,
    salaryRange,
    applyUrl: `https://${source.toLowerCase()}.com/jobs/view/${genId(i + 1)}`,
    description: `${desc} Role: ${title}. Location: ${location}. Mode: ${mode}. Experience: ${experience} years. Apply through ${source}.`,
  };
});

export const JOB_LOCATIONS = [...new Set(JOBS_DATASET.map((j) => j.location))].sort();
