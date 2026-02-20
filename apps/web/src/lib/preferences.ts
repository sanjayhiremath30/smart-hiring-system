const PREFERENCES_KEY = "jobTrackerPreferences";

export type JobTrackerPreferences = {
  roleKeywords: string;
  preferredLocations: string[];
  preferredMode: ("Remote" | "Hybrid" | "Onsite")[];
  experienceLevel: string;
  skills: string;
  minMatchScore: number;
};

export const DEFAULT_PREFERENCES: JobTrackerPreferences = {
  roleKeywords: "",
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: "",
  skills: "",
  minMatchScore: 40,
};

export function loadJobTrackerPreferences(): JobTrackerPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<JobTrackerPreferences>;
    return {
      roleKeywords: parsed.roleKeywords ?? DEFAULT_PREFERENCES.roleKeywords,
      preferredLocations: Array.isArray(parsed.preferredLocations) ? parsed.preferredLocations : DEFAULT_PREFERENCES.preferredLocations,
      preferredMode: Array.isArray(parsed.preferredMode) ? parsed.preferredMode : DEFAULT_PREFERENCES.preferredMode,
      experienceLevel: parsed.experienceLevel ?? DEFAULT_PREFERENCES.experienceLevel,
      skills: parsed.skills ?? DEFAULT_PREFERENCES.skills,
      minMatchScore: typeof parsed.minMatchScore === "number" ? Math.max(0, Math.min(100, parsed.minMatchScore)) : DEFAULT_PREFERENCES.minMatchScore,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveJobTrackerPreferences(prefs: JobTrackerPreferences): void {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
  window.dispatchEvent(new Event("storage"));
}
