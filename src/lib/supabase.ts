/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Course, StudentProfile, TaskItem } from '../types';

// Mengambil URL & Key WAJIB dari Environment Variables (Aman untuk Vercel)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Kredensial Supabase tidak ditemukan di .env');
    return null;
  }
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
  }
  return supabaseClient;
}

export async function loadTasks(): Promise<TaskItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (data) {
      return data.map((d: any) => ({
        id: d.id,
        courseCode: d.course_code,
        courseName: d.course_name,
        title: d.title,
        category: d.category,
        mode: d.mode || 'file',
        status: d.status,
        deadlineText: d.deadline_text,
        deadlineDate: d.deadline_date,
        submittedAt: d.submitted_at,
        fileName: d.file_name,
        fileSize: d.file_size,
        githubUrl: d.github_url,
        notes: d.notes,
        grade: d.grade,
        score: d.score,
        statusLabel: d.status_label,
        tagColor: d.tag_color,
      }));
    }
  } catch (e) {
    console.error('Gagal memuat tugas:', e);
  }
  return [];
}

// UPDATE: Sekarang menerima object File fisik dari komponen BerandaView
export async function submitTask(task: TaskItem, file?: File | null): Promise<TaskItem> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Klien Supabase belum terinisialisasi.');

  let finalFileName = task.fileName;

  // 1. Unggah File fisik ke Supabase Storage (Jika ada file)
  if (task.mode === 'file' && file) {
    const fileExt = file.name.split('.').pop();
    const storageName = `${task.courseCode}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${storageName}`;

    // Pastikan Anda sudah membuat bucket "tugas_mahasiswa" di Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('tugas_mahasiswa')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Gagal mengunggah file: ${uploadError.message}`);
    }

    finalFileName = file.name;
  }

  // 2. Simpan Data Metadata ke Database PostgreSQL
  const row = {
    id: task.id,
    course_code: task.courseCode,
    course_name: task.courseName,
    title: task.title,
    category: task.category,
    mode: task.mode || 'file',
    status: task.status,
    deadline_text: task.deadlineText,
    submitted_at: task.submittedAt,
    file_name: finalFileName,
    file_size: task.fileSize,
    github_url: task.githubUrl,
    notes: task.notes,
    grade: task.grade,
    score: task.score,
    status_label: task.statusLabel,
    tag_color: task.tagColor,
  };

  const { error } = await supabase.from('submissions').insert([row]);
  
  if (error) throw new Error(`Gagal menyimpan data database: ${error.message}`);

  return { ...task, fileName: finalFileName };
}

export async function loadCourses(): Promise<Course[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase.from('courses').select('*');
    if (error) throw error;

    if (data) {
      return data.map((c: any) => ({
        code: c.code,
        name: c.name,
        subtopic: c.subtopic,
        credits: c.credits,
        lecturer: c.lecturer,
        nip: c.nip,
        schedule: c.schedule,
        duration: c.duration,
        room: c.room,
        type: c.type || 'teori',
        attendancePercent: c.attendance_percent,
        attendedSessions: c.attended_sessions,
        totalSessions: c.total_sessions,
        syllabusUrl: c.syllabus_url || '#',
      }));
    }
  } catch (e) {
    console.error('Gagal memuat mata kuliah:', e);
  }
  return [];
}

export async function loadStudentProfile(): Promise<StudentProfile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('student_profiles').select('*').limit(1).single();
    if (error && error.code !== 'PGRST116') throw error; // Abaikan jika tabel kosong

    if (data) {
      return {
        name: data.name,
        nim: data.nim,
        major: data.major,
        department: data.department,
        year: data.academic_year,
        semester: data.semester,
        academicYear: data.academic_year,
        status: data.status,
        bio: data.bio || '',
        techStack: data.tech_stack || [],
        gpa: Number(data.gpa) || 0.0,
        maxGpa: 4.0,
        completedCredits: data.completed_credits,
        currentSemesterCredits: data.current_credits,
        targetCredits: 144,
        attendanceAvg: Number(data.attendance_avg) || 0,
        verified: true,
        avatarUrl: data.avatar_url || 'https://apblemmjoaxvisjxbvhm.supabase.co/storage/v1/object/public/avatar/IMG_0883.JPG',
        academicAdvisor: {
          name: 'Dosen Pembimbing Akademik',
          schedule: 'Menunggu jadwal dari portal...',
          krsStatus: 'Disetujui',
        },
        examSchedule: {
          name: 'Ujian Akhir Semester (UAS)',
          period: 'Menunggu sinkronisasi jadwal...',
          countdownDays: 0,
        },
        syncStatus: {
          totalSubmitted: 0,
          allGitSynced: true,
          averageScore: 0,
        },
      };
    }
  } catch (e) {
    console.error('Gagal memuat profil mahasiswa:', e);
  }
  return null;
}