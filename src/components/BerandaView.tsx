import React, { useState, useRef } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  UploadCloud,
  FileText,
  Paperclip,
  Check,
  Copy,
  ChevronDown,
  ShieldCheck,
  ExternalLink,
  Send,
  Database,
  FileCode,
  FileArchive,
  AlertCircle,
  Clock3,
  MoreVertical,
} from 'lucide-react';
import { Course, SubmissionCategory, SubmissionMode, TaskItem } from '../types';

interface BerandaViewProps {
  courses: Course[];
  tasks: TaskItem[];
  onSubmitTask: (newTask: TaskItem, file: File | null) => Promise<void>; // Tambahkan parameter file
  onFillTaskForm: (task: TaskItem) => void;
  selectedCourseCode: string;
  setSelectedCourseCode: (code: string) => void;
}

export const BerandaView: React.FC<BerandaViewProps> = ({
  courses,
  tasks,
  onSubmitTask,
  selectedCourseCode,
  setSelectedCourseCode,
}) => {
  // Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<SubmissionCategory>('Tugas Individu');
  const [submissionMode, setSubmissionMode] = useState<SubmissionMode>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [shortNote, setShortNote] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [lecturerNotes, setLecturerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Right Column Filter State
  const [activeFilter, setActiveFilter] = useState<'semua' | 'mendesak' | 'review' | 'selesai'>('semua');
  const [copiedRule, setCopiedRule] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Drag & Drop Handlers
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCopyNamingRule = () => {
    navigator.clipboard.writeText('NIM_NAMA_KELAS_TUGAS{NOMOR}.zip');
    setCopiedRule(true);
    setTimeout(() => setCopiedRule(false), 2000);
  };

  const handleKerjakanForm = (task: TaskItem) => {
    setSelectedCourseCode(task.courseCode);
    setTaskTitle(task.title);
    setTaskCategory(task.category);
    // Smooth scroll to form on mobile
    const formElement = document.getElementById('assignment-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedCourseCode) {
      setErrorMessage('Pilih mata kuliah terlebih dahulu.');
      return;
    }
    if (!taskTitle.trim()) {
      setErrorMessage('Judul tugas wajib diisi.');
      return;
    }
    if (submissionMode === 'file' && !selectedFile) {
      setErrorMessage('Silakan pilih berkas tugas untuk diunggah.');
      return;
    }
    if (submissionMode === 'note' && !shortNote.trim()) {
      setErrorMessage('Silakan tuliskan catatan tugas.');
      return;
    }

    setIsSubmitting(true);
    try {
      const currentCourse = courses.find((c) => c.code === selectedCourseCode);
      const courseName = currentCourse ? currentCourse.name : 'Mata Kuliah';
      const now = new Date();
      const formattedDate = `${now.getDate()} ${now.toLocaleString('id-ID', { month: 'short' })}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

      const newTask: TaskItem = {
        id: `sub-${Date.now()}`,
        courseCode: selectedCourseCode,
        courseName: courseName,
        title: taskTitle.trim(),
        category: taskCategory,
        mode: submissionMode,
        status: 'menunggu_review',
        submittedAt: formattedDate,
        fileName: selectedFile ? selectedFile.name : undefined, // Nama sementara, akan diupdate di backend
        fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : undefined,
        githubUrl: githubUrl.trim() || undefined,
        notes: lecturerNotes.trim() || (submissionMode === 'note' ? shortNote : undefined),
        statusLabel: 'Menunggu Review Dosen',
        tagColor: 'purple',
      };

      // Meneruskan object newTask DAN File fisik ke App.tsx -> Supabase.ts
      await onSubmitTask(newTask, submissionMode === 'file' ? selectedFile : null);

      setTaskTitle('');
      setSelectedFile(null);
      setShortNote('');
      setGithubUrl('');
      setLecturerNotes('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi kesalahan saat menyimpan tugas.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'semua') return true;
    if (activeFilter === 'mendesak') return task.status === 'deadline_dekat';
    if (activeFilter === 'review') return task.status === 'menunggu_review';
    if (activeFilter === 'selesai') return task.status === 'terkumpul_tepat_waktu';
    return true;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Banner & Stats Area */}
      <section aria-labelledby="page-title" className="space-y-4">
        {/* Academic Breadcrumb pill */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#18181b] border border-[#27272a] text-[#a1a1aa]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]"></span>
          <span>PORTAL TUGAS AKADEMIK</span>
          <span>•</span>
          <span>SEMESTER GENAP</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1
              id="page-title"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[#fafafa]"
            >
              Pengumpulan Tugas Mahasiswa
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-xs text-[#a1a1aa]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#a1a1aa]" />
                <span>Kamis, 24 Oktober 2024</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 text-[#fbbf24]">
                <Clock className="w-3.5 h-3.5 text-[#fbbf24]" />
                <span>Deadline Terdekat: Praktikum UI/UX (Besok, 23:59 WIB)</span>
              </div>
            </div>
          </div>

          {/* Top 3 Stat Cards matching Image 4 */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {/* Tugas Selesai */}
            <div className="bg-[#0c0c0f] border border-[#27272a] rounded-xl px-4 py-3 min-w-[100px] sm:min-w-[120px]">
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#a1a1aa] font-medium">
                Tugas Selesai
              </span>
              <div className="text-xl sm:text-2xl font-bold text-[#34d399] mt-1 font-mono">
                14<span className="text-[#a1a1aa] text-base font-normal">/18</span>
              </div>
            </div>

            {/* Menunggu Review */}
            <div className="bg-[#0c0c0f] border border-[#27272a] rounded-xl px-4 py-3 min-w-[100px] sm:min-w-[120px]">
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#a1a1aa] font-medium">
                Menunggu Review
              </span>
              <div className="text-xl sm:text-2xl font-bold text-[#a78bfa] mt-1 font-mono">
                3
              </div>
            </div>

            {/* Rata-Rata Nilai */}
            <div className="bg-[#0c0c0f] border border-[#27272a] rounded-xl px-4 py-3 min-w-[100px] sm:min-w-[120px]">
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#a1a1aa] font-medium">
                Rata-rata Nilai
              </span>
              <div className="text-xl sm:text-2xl font-bold text-[#fafafa] mt-1 font-mono">
                92.4
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Left Form (7 cols on lg) vs Right Task List (5 cols on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: FORMULIR PENYERAHAN TUGAS */}
        <section
          id="assignment-form"
          aria-labelledby="form-heading"
          className="lg:col-span-7 space-y-4"
        >
          <div className="bg-[#0c0c0f] border border-[#27272a] rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            {/* Top subtle glow accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#a78bfa]/40 to-transparent" />

            {/* Form Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#27272a] mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa]">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 id="form-heading" className="text-sm sm:text-base font-semibold text-[#fafafa]">
                  Formulir Penyerahan Tugas
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/20">
                Formulir Aktif
              </span>
            </div>

            {submitSuccess && (
              <div className="mb-5 p-3.5 rounded-lg bg-[#34d399]/10 border border-[#34d399]/30 text-[#34d399] text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Tugas berhasil diserahkan dan tersimpan ke database!</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 1. PILIH MATA KULIAH */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#a1a1aa] mb-2">
                  1. Pilih Mata Kuliah <span className="text-[#a78bfa]">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedCourseCode}
                    onChange={(e) => setSelectedCourseCode(e.target.value)}
                    className="w-full appearance-none bg-[#121215] border border-[#27272a] rounded-lg px-3.5 py-2.5 text-xs text-[#fafafa] focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] cursor-pointer"
                  >
                    <option value="" className="bg-[#121215] text-[#71717a]">
                      -- Pilih Mata Kuliah Terdaftar --
                    </option>
                    {courses.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#121215] text-[#fafafa]">
                        {c.code} - {c.name} ({c.credits} SKS)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-[#71717a] pointer-events-none" />
                </div>
              </div>

              {/* 2. JUDUL TUGAS & KATEGORI TUGAS */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-7">
                  <label className="block text-xs font-semibold tracking-wider uppercase text-[#a1a1aa] mb-2">
                    2. Judul Tugas <span className="text-[#a78bfa]">*</span>
                  </label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Misal: Implementasi Redux & REST API"
                    className="w-full bg-[#121215] border border-[#27272a] rounded-lg px-3.5 py-2.5 text-xs text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold tracking-wider uppercase text-[#a1a1aa] mb-2">
                    Kategori Tugas <span className="text-[#a78bfa]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={taskCategory}
                      onChange={(e) => setTaskCategory(e.target.value as SubmissionCategory)}
                      className="w-full appearance-none bg-[#121215] border border-[#27272a] rounded-lg px-3.5 py-2.5 text-xs text-[#fafafa] focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] cursor-pointer"
                    >
                      <option value="Tugas Individu" className="bg-[#121215]">
                        Tugas Individu
                      </option>
                      <option value="Tugas Kelompok" className="bg-[#121215]">
                        Tugas Kelompok
                      </option>
                      <option value="Proyek Akhir" className="bg-[#121215]">
                        Proyek Akhir
                      </option>
                      <option value="Praktikum Lab" className="bg-[#121215]">
                        Praktikum Lab
                      </option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-[#71717a] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 3. MODE PENGUMPULAN & DROPZONE */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-[#a1a1aa]">
                    3. Mode Pengumpulan <span className="text-[#a78bfa]">*</span>
                  </label>
                  <span className="text-[11px] text-[#a78bfa] font-medium">
                    {submissionMode === 'file' ? 'Moda Berkas / File' : 'Moda Catatan / Teks'}
                  </span>
                </div>

                {/* Mode Selector pills */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#121215] border border-[#27272a] rounded-lg mb-3">
                  <button
                    type="button"
                    onClick={() => setSubmissionMode('file')}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                      submissionMode === 'file'
                        ? 'bg-[#18181b] text-[#fafafa] border border-[#27272a] shadow-sm'
                        : 'text-[#a1a1aa] hover:text-[#fafafa]'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-[#a78bfa]" />
                    <span>Unggah Berkas / File</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubmissionMode('note')}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                      submissionMode === 'note'
                        ? 'bg-[#18181b] text-[#fafafa] border border-[#27272a] shadow-sm'
                        : 'text-[#a1a1aa] hover:text-[#fafafa]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-[#a78bfa]" />
                    <span>Tulis Catatan / Pendek</span>
                  </button>
                </div>

                {/* Drag and Drop Box */}
                {submissionMode === 'file' ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? 'border-[#a78bfa] bg-[#a78bfa]/5'
                        : 'border-[#27272a] hover:border-[#a78bfa]/60 bg-[#121215]/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.zip,.docx,.tar.gz,.rar"
                    />

                    <div className="w-10 h-10 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center mx-auto mb-2 text-[#a78bfa]">
                      <UploadCloud className="w-5 h-5" />
                    </div>

                    {selectedFile ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#fafafa]">
                          <FileArchive className="w-4 h-4 text-[#34d399]" />
                          <span>{selectedFile.name}</span>
                        </div>
                        <p className="text-[11px] text-[#a1a1aa]">
                          Ukuran: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Siap diunggah
                        </p>
                        <span className="inline-block text-[11px] text-[#a78bfa] hover:underline mt-1">
                          Klik untuk mengganti file
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-[#fafafa]">
                          Tarik & Lepas berkas ke sini, atau{' '}
                          <span className="text-[#a78bfa] underline underline-offset-2">
                            jelajahi folder
                          </span>
                        </p>
                        <p className="text-[11px] text-[#71717a]">
                          Mendukung ekstensi: .PDF, .ZIP, .DOCX, .TAR.GZ (Maks. 25 MB)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={shortNote}
                      onChange={(e) => setShortNote(e.target.value)}
                      placeholder="Ketik catatan pengumpulan tugas atau jawaban ringkas di sini..."
                      rows={4}
                      className="w-full bg-[#121215] border border-[#27272a] rounded-lg p-3 text-xs text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]"
                    />
                    <div className="text-right text-[11px] text-[#71717a] mt-1">
                      {shortNote.length} karakter
                    </div>
                  </div>
                )}
              </div>

              {/* TAUTAN REPOSITORY GITHUB & CATATAN UNTUK DOSEN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-[#a1a1aa] mb-2">
                    &lt;&gt; Tautan Repository GitHub <span className="text-[10px] text-[#71717a]">(opsional)</span>
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full bg-[#121215] border border-[#27272a] rounded-lg px-3.5 py-2.5 text-xs text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-[#a1a1aa] mb-2">
                    Catatan Untuk Dosen Pengampu <span className="text-[10px] text-[#71717a]">(opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={lecturerNotes}
                    onChange={(e) => setLecturerNotes(e.target.value)}
                    placeholder="Misal: Sudah termasuk dokumentasi PDF bab 1-3"
                    className="w-full bg-[#121215] border border-[#27272a] rounded-lg px-3.5 py-2.5 text-xs text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]"
                  />
                </div>
              </div>

              {/* Form Bottom: Encryption Note & Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                  <ShieldCheck className="w-4 h-4 text-[#34d399]" />
                  <span>Enkripsi SHA-256 tersimpan ke database kampus</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#a78bfa] hover:bg-[#906df8] text-[#09090b] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#09090b] border-t-transparent rounded-full animate-spin" />
                      <span>Mengirim Tugas...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Tugas Sekarang</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Helper Banner below form: Aturan Penamaan Berkas Standar */}
          <div className="bg-[#0c0c0f] border border-[#27272a] rounded-xl p-3.5 px-4 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#34d399] shrink-0">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] text-[#a1a1aa] font-medium">
                  Aturan Penamaan Berkas Standar
                </span>
                <span className="font-mono text-[#fafafa] text-xs">
                  NIM_NAMA_KELAS_TUGAS&#123;NOMOR&#125;.zip
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyNamingRule}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#18181b] border border-[#27272a] text-[#fafafa] hover:bg-[#27272a] transition-colors text-xs shrink-0"
            >
              {copiedRule ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#34d399]" />
                  <span className="text-[#34d399]">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#a1a1aa]" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* RIGHT COLUMN: STATUS & RIWAYAT TUGAS */}
        <section
          aria-labelledby="tasks-heading"
          className="lg:col-span-5 space-y-4"
        >
          <div className="bg-[#0c0c0f] border border-[#27272a] rounded-xl p-5 sm:p-6 shadow-xl space-y-5">
            {/* Header & Total Count */}
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h2 id="tasks-heading" className="text-sm sm:text-base font-semibold text-[#fafafa]">
                  Status & Riwayat Tugas
                </h2>
              </div>
              <span className="text-xs text-[#a1a1aa] font-mono">
                {tasks.length} Total
              </span>
            </div>

            {/* Filter Tabs matching Image 4 */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveFilter('semua')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                  activeFilter === 'semua'
                    ? 'bg-[#18181b] text-[#fafafa] border border-[#27272a]'
                    : 'text-[#a1a1aa] hover:text-[#fafafa]'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('mendesak')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                  activeFilter === 'mendesak'
                    ? 'bg-[#18181b] text-[#fafafa] border border-[#27272a]'
                    : 'text-[#a1a1aa] hover:text-[#fafafa]'
                }`}
              >
                Mendesak
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('review')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                  activeFilter === 'review'
                    ? 'bg-[#18181b] text-[#fafafa] border border-[#27272a]'
                    : 'text-[#a1a1aa] hover:text-[#fafafa]'
                }`}
              >
                Menunggu Review
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('selesai')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                  activeFilter === 'selesai'
                    ? 'bg-[#18181b] text-[#fafafa] border border-[#27272a]'
                    : 'text-[#a1a1aa] hover:text-[#fafafa]'
                }`}
              >
                Selesai
              </button>
            </div>

            {/* Task Card Items */}
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#a1a1aa]">
                  Tidak ada tugas dalam kategori ini.
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-lg bg-[#121215] border border-[#27272a] hover:border-[#a78bfa]/40 transition-colors space-y-2.5"
                  >
                    {/* Badge row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            task.status === 'deadline_dekat'
                              ? 'bg-[#f59e0b]'
                              : task.status === 'menunggu_review'
                              ? 'bg-[#a78bfa]'
                              : 'bg-[#34d399]'
                          }`}
                        />
                        <span
                          className={`text-[11px] font-medium ${
                            task.status === 'deadline_dekat'
                              ? 'text-[#f59e0b]'
                              : task.status === 'menunggu_review'
                              ? 'text-[#a78bfa]'
                              : 'text-[#34d399]'
                          }`}
                        >
                          {task.statusLabel ||
                            (task.status === 'deadline_dekat'
                              ? 'Deadline Mendekati'
                              : task.status === 'menunggu_review'
                              ? 'Menunggu Review Dosen'
                              : 'Terkumpul Tepat Waktu')}
                        </span>
                      </div>

                      {/* Icon on top right */}
                      {task.status === 'deadline_dekat' && (
                        <Clock3 className="w-3.5 h-3.5 text-[#f59e0b]" />
                      )}
                      {task.status === 'menunggu_review' && (
                        <MoreVertical className="w-3.5 h-3.5 text-[#a1a1aa]" />
                      )}
                      {task.status === 'terkumpul_tepat_waktu' && (
                        <Check className="w-3.5 h-3.5 text-[#34d399]" />
                      )}
                    </div>

                    {/* Task Title & Course */}
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-[#fafafa] leading-snug">
                        {task.title}
                      </h3>
                      <p className="text-[11px] text-[#a1a1aa] mt-0.5">
                        {task.courseName} • {task.category}
                      </p>
                    </div>

                    {/* Bottom detail row */}
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#27272a]/60">
                      {task.status === 'deadline_dekat' && (
                        <>
                          <span className="text-[#a1a1aa]">Batas: {task.deadlineText}</span>
                          <button
                            type="button"
                            onClick={() => handleKerjakanForm(task)}
                            className="text-[#a78bfa] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <span>Kerjakan Form</span>
                            <span>&rarr;</span>
                          </button>
                        </>
                      )}

                      {task.status === 'menunggu_review' && (
                        <>
                          <span className="text-[#a1a1aa]">Diserahkan: {task.submittedAt}</span>
                          {task.fileName && (
                            <span className="text-[#a78bfa] flex items-center gap-1 font-mono text-[10px]">
                              <Paperclip className="w-3 h-3" />
                              {task.fileName}
                            </span>
                          )}
                        </>
                      )}

                      {task.status === 'terkumpul_tepat_waktu' && (
                        <>
                          <span className="text-[#34d399] font-medium font-mono">
                            Nilai: {task.grade}
                          </span>
                          <span className="text-[#a1a1aa]">Selesai Dinilai</span>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom On-Time Semester Rate Bar Visualizer matching Image 4 */}
            <div className="pt-4 border-t border-[#27272a] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#a1a1aa]">
                  Tingkat Ketepatan Waktu Semester Ini
                </span>
                <span className="text-xs font-mono font-bold text-[#34d399]">
                  96.8% On-Time
                </span>
              </div>

              {/* Progress bar blocks (M1, M2, M3, M4, M5) */}
              <div className="grid grid-cols-5 gap-1.5">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-full h-8 rounded bg-[#18181b] border border-[#27272a]" />
                  <span className="text-[10px] text-[#71717a] font-mono">M1</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-full h-8 rounded bg-[#18181b] border border-[#27272a]" />
                  <span className="text-[10px] text-[#71717a] font-mono">M2</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-full h-8 rounded bg-[#a78bfa] shadow-sm shadow-[#a78bfa]/20" />
                  <span className="text-[10px] text-[#71717a] font-mono">M3</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-full h-8 rounded bg-[#34d399] shadow-sm shadow-[#34d399]/20" />
                  <span className="text-[10px] text-[#71717a] font-mono">M4</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-full h-8 rounded bg-[#18181b] border border-[#27272a]" />
                  <span className="text-[10px] text-[#71717a] font-mono">M5</span>
                </div>
              </div>

              <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                Kamu telah menyelesaikan 4 tugas tepat waktu berturut-turut tanpa denda penalti keterlambatan.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
