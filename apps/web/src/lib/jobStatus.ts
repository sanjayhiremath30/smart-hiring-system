const STATUS_KEY = "jobTrackerStatus";
const STATUS_LOG_KEY = "jobTrackerStatusLog";
const MAX_LOG_ENTRIES = 50;

export type JobStatus = "Not Applied" | "Applied" | "Rejected" | "Selected";

export type StatusLogEntry = {
  jobId: string;
  title: string;
  company: string;
  status: string;
  dateChanged: string;
};

export function getJobStatus(jobId: string): JobStatus {
  if (typeof window === "undefined") return "Not Applied";
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, JobStatus>) : {};
    const s = map[jobId];
    return s === "Applied" || s === "Rejected" || s === "Selected" ? s : "Not Applied";
  } catch {
    return "Not Applied";
  }
}

export function getAllStatuses(): Record<string, JobStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, JobStatus>) : {};
  } catch {
    return {};
  }
}

export function setJobStatus(
  jobId: string,
  status: JobStatus,
  meta: { title: string; company: string }
): void {
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, JobStatus>) : {};
    map[jobId] = status;
    localStorage.setItem(STATUS_KEY, JSON.stringify(map));

    const logRaw = localStorage.getItem(STATUS_LOG_KEY);
    const log: StatusLogEntry[] = logRaw ? JSON.parse(logRaw) : [];
    log.unshift({
      jobId,
      title: meta.title,
      company: meta.company,
      status,
      dateChanged: new Date().toISOString(),
    });
    localStorage.setItem(STATUS_LOG_KEY, JSON.stringify(log.slice(0, MAX_LOG_ENTRIES)));
    window.dispatchEvent(new Event("storage"));
  } catch {
    // ignore
  }
}

export function getStatusLog(): StatusLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STATUS_LOG_KEY);
    return raw ? (JSON.parse(raw) as StatusLogEntry[]) : [];
  } catch {
    return [];
  }
}

export function statusBadgeClass(status: JobStatus): string {
  switch (status) {
    case "Applied":
      return "bg-blue-500/20 text-blue-400";
    case "Rejected":
      return "bg-red-500/20 text-red-400";
    case "Selected":
      return "bg-green-500/20 text-green-400";
    default:
      return "bg-white/10 text-gray-400";
  }
}
