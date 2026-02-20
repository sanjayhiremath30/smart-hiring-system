import type { JobListing } from "@/lib/jobsData";
import type { JobTrackerPreferences } from "@/lib/preferences";

export function computeMatchScore(job: JobListing, prefs: JobTrackerPreferences): number {
  let score = 0;
  const roleKeywords = prefs.roleKeywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
  const userSkills = prefs.skills.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const titleLower = job.title.toLowerCase();
  const descLower = job.description.toLowerCase();

  if (roleKeywords.some((k) => titleLower.includes(k))) score += 25;
  if (roleKeywords.some((k) => descLower.includes(k))) score += 15;
  if (prefs.preferredLocations.length && prefs.preferredLocations.includes(job.location)) score += 15;
  if (prefs.preferredMode.length && prefs.preferredMode.includes(job.mode)) score += 10;
  if (prefs.experienceLevel && job.experience === prefs.experienceLevel) score += 10;
  const jobSkillsLower = job.skills.map((s) => s.toLowerCase());
  if (userSkills.length && userSkills.some((us) => jobSkillsLower.includes(us))) score += 15;
  if (job.postedDaysAgo <= 2) score += 5;
  if (job.source === "LinkedIn") score += 5;

  return Math.min(100, score);
}
