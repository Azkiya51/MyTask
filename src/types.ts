export type ViewTab = 'beranda' | 'profil' | 'pengelola';

export type SubmissionCategory = 'Tugas Individu' | 'Tugas Kelompok' | 'Proyek Akhir' | 'Praktikum Lab';

export type SubmissionMode = 'file' | 'note';

export type TaskStatus = 
  | 'deadline_dekat'
  | 'menunggu_review'
  | 'terkumpul_tepat_waktu'
  | 'belum_diserahkan';

export interface TaskItem {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  category: SubmissionCategory;
  mode?: SubmissionMode;
  status: TaskStatus;
  deadlineText?: string;
  deadlineDate?: string;
  submittedAt?: string;
  fileName?: string;
  fileSize?: string;
  githubUrl?: string;
  notes?: string;
  grade?: string; // e.g., "95/100 (Grade A)"
  score?: number;
  statusLabel?: string;
  tagColor?: 'amber' | 'purple' | 'emerald' | 'zinc';
}

export interface Course {
  code: string;
  name: string;
  subtopic: string;
  credits: number;
  lecturer: string;
  nip: string;
  schedule: string;
  duration: string;
  room: string;
  type: 'teori' | 'lab';
  attendancePercent: number;
  attendedSessions: number;
  totalSessions: number;
  syllabusUrl?: string;
}

export interface StudentProfile {
  name: string;
  nim: string;
  major: string;
  department: string;
  year: string;
  semester: number;
  academicYear: string;
  status: 'Aktif' | 'Cuti' | 'Lulus';
  bio: string;
  techStack: string[];
  gpa: number;
  maxGpa: number;
  completedCredits: number;
  currentSemesterCredits: number;
  targetCredits: number;
  attendanceAvg: number;
  verified: boolean;
  avatarUrl: string;
  academicAdvisor: {
    name: string;
    schedule: string;
    krsStatus: 'Disetujui' | 'Menunggu' | 'Ditolak';
  };
  examSchedule: {
    name: string;
    period: string;
    countdownDays: number;
  };
  syncStatus: {
    totalSubmitted: number;
    allGitSynced: boolean;
    averageScore: number;
  };
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
