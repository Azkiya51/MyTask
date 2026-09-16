import React, { useState } from 'react';
import {
  StudentProfile,
  Course,
} from '../types';
import {
  Printer,
  TrendingUp,
  GraduationCap,
  Disc as DiscordIcon,
  Clock,
  Search,
  CheckCircle2,
  FileDown,
  ShieldCheck,
  Calendar,
  CloudCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ProfilViewProps {
  student: StudentProfile;
  courses: Course[];
}

export const ProfilView: React.FC<ProfilViewProps> = ({ student, courses }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<'all' | 'lab' | 'teori'>('all');
  const [downloadingCode, setDownloadingCode] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSyllabus = (code: string, courseName: string) => {
    setDownloadingCode(code);
    setTimeout(() => {
      setDownloadingCode(null);
      alert(`Silabus untuk mata kuliah ${code} - ${courseName} berhasil diunduh (Format PDF).`);
    }, 600);
  };

  // Filter courses by search query and type
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lecturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.room.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (courseFilter === 'all') return true;
    if (courseFilter === 'lab') return c.type === 'lab';
    if (courseFilter === 'teori') return c.type === 'teori';
    return true;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Print Action Bar matching Image 6 */}
      <section aria-label="Breadcrumb Bar" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#27272a]">
        <div className="flex items-center gap-2 font-mono text-xs text-[#a1a1aa]">
          <span className="text-[#a78bfa]">SI-AKAD</span>
          <span>//</span>
          <span>CORE</span>
          <span>/</span>
          <span>MAHASISWA</span>
          <span>/</span>
          <span className="text-[#fafafa] font-semibold">{student.nim}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#121215] border border-[#27272a] text-[#34d399]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span>
            <span>SYNCED SMT {student.semester} ({student.academicYear.toUpperCase()})</span>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[#fafafa] bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#a1a1aa]" />
            <span>Cetak KHS/Profil</span>
          </button>
        </div>
      </section>

      {/* SECTION 1: STUDENT PROFILE BANNER CARD */}
      <section aria-label="Student Profile" className="bg-[#0c0c0f] border border-[#27272a] rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#a78bfa]/30 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Avatar and Basic Info */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with Verified Badge */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-2 ring-[#27272a] bg-[#121215]">
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute bottom-1 right-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#09090b]/90 border border-[#34d399]/40 text-[10px] font-mono font-medium text-[#34d399]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span>
                VERIFIED
              </span>
            </div>

            {/* Profile Text Info */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#fafafa]">
                  {student.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#18181b] border border-[#27272a] text-[#a78bfa]">
                  {student.status}
                </span>
              </div>

              <div className="text-xs text-[#a1a1aa] font-mono flex flex-wrap items-center gap-2">
                <span>NIM: <span className="text-[#a78bfa] font-semibold">{student.nim}</span></span>
                <span>•</span>
                <span>{student.major}</span>
                <span>•</span>
                <span>Angkatan {student.year}</span>
              </div>

              <p className="text-xs text-[#a1a1aa] italic leading-relaxed max-w-2xl pt-1">
                {student.bio}
              </p>

              {/* Stack Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[10px] font-mono uppercase text-[#71717a] mr-1">
                  STACK :
                </span>
                {student.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-[#18181b] border border-[#27272a] text-[#fafafa]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Metrics Cards matching Image 6 */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {/* IPK Kumulatif */}
            <div className="bg-[#121215] border border-[#27272a] rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-medium text-[#a1a1aa]">
                <span className="uppercase tracking-wider">IPK Kumulatif</span>
                <TrendingUp className="w-3.5 h-3.5 text-[#34d399]" />
              </div>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-2xl font-bold text-[#34d399]">{student.gpa.toFixed(2)}</span>
                <span className="text-xs text-[#a1a1aa]">/ {student.maxGpa.toFixed(2)}</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-[#18181b] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#34d399] h-full rounded-full"
                  style={{ width: `${(student.gpa / student.maxGpa) * 100}%` }}
                />
              </div>
            </div>

            {/* Total SKS Lulus */}
            <div className="bg-[#121215] border border-[#27272a] rounded-xl p-3.5 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-medium text-[#a1a1aa]">
                <span className="uppercase tracking-wider">Total SKS Lulus</span>
                <GraduationCap className="w-3.5 h-3.5 text-[#a78bfa]" />
              </div>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-2xl font-bold text-[#fafafa]">{student.completedCredits}</span>
                <span className="text-xs text-[#a78bfa]">
                  + {student.currentSemesterCredits} SKS Smt Ini
                </span>
              </div>
              <span className="text-[10px] text-[#71717a] block">
                Status: On Track (Target {student.targetCredits} SKS)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: OFFICIAL DISCORD HUB CARD */}
      <section aria-label="Official Discord Hub" className="bg-[#121218] border border-[#27272a] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center shrink-0">
            <DiscordIcon className="w-6 h-6 text-[#5865F2]" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#a1a1aa]">
              <span className="text-[#a78bfa] font-semibold">OFFICIAL DISCORD HUB</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#34d399]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span>
                184 Online
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-[#fafafa]">
              Gabung Komunitas Discord Kelas & Studi TI 2024
            </h2>
            <p className="text-xs text-[#a1a1aa] max-w-2xl leading-relaxed">
              Pusat diskusi tugas harian, file repositori kuliah, pengingat tenggat waktu, dan kanal suara belajar bersama rekan seangkatan.
            </p>
          </div>
        </div>

        <a
          href="https://discord.gg"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2.5 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <DiscordIcon className="w-4 h-4" />
          <span>Join Discord Server</span>
          <span>&rarr;</span>
        </a>
      </section>

      {/* SECTION 3: JADWAL & STATUS KULIAH */}
      <section aria-labelledby="schedule-heading" className="bg-[#0c0c0f] border border-[#27272a] rounded-xl p-5 sm:p-6 shadow-xl space-y-5">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#27272a]">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#a78bfa] uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Jadwal & Status Kuliah</span>
            </div>
            <h2 id="schedule-heading" className="text-base sm:text-lg font-bold text-[#fafafa]">
              Mata Kuliah Semester Genap 2023/2024
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#18181b] border border-[#27272a] text-[#fafafa] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]"></span>
              <span>TOTAL BEBAN: 15 SKS (5 MK)</span>
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#18181b] border border-[#27272a] text-[#34d399] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span>
              <span>RATA-RATA PRESENSI: 96.4%</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#71717a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode MK, nama mata kuliah, dosen, atau ruang..."
              className="w-full bg-[#121215] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-xs text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto text-xs">
            <span className="text-[11px] text-[#71717a] uppercase font-mono mr-1">TAMPILKAN:</span>
            <button
              type="button"
              onClick={() => setCourseFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                courseFilter === 'all'
                  ? 'bg-[#a78bfa] text-[#09090b] font-semibold'
                  : 'bg-[#18181b] text-[#a1a1aa] hover:text-[#fafafa] border border-[#27272a]'
              }`}
            >
              Semua ({courses.length})
            </button>
            <button
              type="button"
              onClick={() => setCourseFilter('lab')}
              className={`px-3 py-1 rounded-md transition-colors ${
                courseFilter === 'lab'
                  ? 'bg-[#a78bfa] text-[#09090b] font-semibold'
                  : 'bg-[#18181b] text-[#a1a1aa] hover:text-[#fafafa] border border-[#27272a]'
              }`}
            >
              Praktikum / Lab
            </button>
            <button
              type="button"
              onClick={() => setCourseFilter('teori')}
              className={`px-3 py-1 rounded-md transition-colors ${
                courseFilter === 'teori'
                  ? 'bg-[#a78bfa] text-[#09090b] font-semibold'
                  : 'bg-[#18181b] text-[#a1a1aa] hover:text-[#fafafa] border border-[#27272a]'
              }`}
            >
              Kelas Teori
            </button>
          </div>
        </div>

        {/* Responsive Table matching Image 6 */}
        <div className="overflow-x-auto border border-[#27272a] rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121215] border-b border-[#27272a] text-[11px] uppercase tracking-wider text-[#a1a1aa] font-mono">
              <tr>
                <th className="py-3 px-4">KODE</th>
                <th className="py-3 px-4">MATA KULIAH</th>
                <th className="py-3 px-3 text-center">SKS</th>
                <th className="py-3 px-4">DOSEN PENGAMPU</th>
                <th className="py-3 px-4">HARI & JAM</th>
                <th className="py-3 px-4">RUANG / KELAS</th>
                <th className="py-3 px-4 text-center">KEHADIRAN</th>
                <th className="py-3 px-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]/70">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#a1a1aa]">
                    Tidak ada mata kuliah yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((c) => (
                  <tr
                    key={c.code}
                    className="hover:bg-[#18181b]/50 transition-colors group"
                  >
                    {/* KODE */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#a78bfa] whitespace-nowrap">
                      {c.code}
                    </td>

                    {/* MATA KULIAH */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]"></span>
                        <span className="font-semibold text-[#fafafa]">{c.name}</span>
                      </div>
                      <span className="text-[11px] text-[#a1a1aa] pl-3.5 block">
                        {c.subtopic}
                      </span>
                    </td>

                    {/* SKS */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] font-mono text-xs text-[#fafafa]">
                        {c.credits}
                      </span>
                    </td>

                    {/* DOSEN PENGAMPU */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-[#fafafa]">{c.lecturer}</div>
                      <div className="text-[10px] text-[#71717a] font-mono">{c.nip}</div>
                    </td>

                    {/* HARI & JAM */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-[#fafafa]">{c.schedule}</div>
                      <div className="text-[10px] text-[#71717a]">{c.duration}</div>
                    </td>

                    {/* RUANG / KELAS */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#18181b] border border-[#27272a] text-[11px] text-[#fafafa] font-mono">
                        <span>{c.room}</span>
                      </span>
                    </td>

                    {/* KEHADIRAN */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex flex-col items-center">
                        <div className="flex items-center gap-1 text-[#34d399] font-mono font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{c.attendancePercent}%</span>
                        </div>
                        <span className="text-[10px] text-[#71717a] font-mono">
                          {c.attendedSessions} / {c.totalSessions} Pertemuan
                        </span>
                      </div>
                    </td>

                    {/* AKSI */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDownloadSyllabus(c.code, c.name)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs bg-[#18181b] border border-[#27272a] text-[#fafafa] hover:bg-[#27272a] hover:text-[#a78bfa] transition-colors cursor-pointer"
                        title="Unduh Silabus Perkuliahan"
                      >
                        <span>Silabus</span>
                        <FileDown className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Information */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs pt-1">
          <div className="flex items-center gap-2 text-[#a1a1aa]">
            <span className="w-2 h-2 rounded-full bg-[#34d399]"></span>
            <span>
              Menampilkan <span className="text-[#fafafa] font-medium">{filteredCourses.length}</span> dari{' '}
              {courses.length} Mata Kuliah Terdaftar
            </span>
          </div>

          <div className="text-[11px] text-[#a1a1aa] font-mono">
            Ketentuan Absensi Minimal: 75% •{' '}
            <span className="text-[#34d399] font-semibold">Status: Memenuhi Syarat UAS</span>
          </div>
        </div>
      </section>

      {/* SECTION 4: 3 BOTTOM CARDS */}
      <section aria-label="Academic Details" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. DOSEN PEMBIMBING AKADEMIK */}
        <div className="bg-[#0c0c0f] border border-[#27272a] rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
            <span>Dosen Pembimbing Akademik</span>
            <ShieldCheck className="w-4 h-4 text-[#a78bfa]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#fafafa]">
              {student.academicAdvisor.name}
            </h3>
            <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
              {student.academicAdvisor.schedule}
            </p>
          </div>
          <div className="pt-1 flex items-center justify-between text-xs border-t border-[#27272a]/60">
            <span className="text-[#a1a1aa]">Status KRS: {student.academicAdvisor.krsStatus}</span>
            <span className="text-[#34d399] flex items-center gap-1 font-medium font-mono text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Valid
            </span>
          </div>
        </div>

        {/* 2. AGENDA UJIAN */}
        <div className="bg-[#0c0c0f] border border-[#27272a] rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#34d399] uppercase tracking-wider">
            <span>Agenda Ujian</span>
            <Calendar className="w-4 h-4 text-[#34d399]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#fafafa]">
              {student.examSchedule.name}
            </h3>
            <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
              {student.examSchedule.period}
            </p>
          </div>
          <div className="pt-1 flex items-center justify-between text-xs border-t border-[#27272a]/60">
            <span className="text-[#a1a1aa]">Hitung Mundur:</span>
            <span className="text-[#a78bfa] font-mono font-bold">
              {student.examSchedule.countdownDays} Hari Lagi
            </span>
          </div>
        </div>

        {/* 3. TUGAS TERSINKRON */}
        <div className="bg-[#0c0c0f] border border-[#27272a] rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#a78bfa] uppercase tracking-wider">
            <span>Tugas Tersinkron</span>
            <CloudCheck className="w-4 h-4 text-[#a78bfa]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#fafafa]">
              {student.syncStatus.totalSubmitted} Tugas Diserahkan
            </h3>
            <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
              Tidak ada keterlambatan pengumpulan di portal MyTask. Semua kode tugas telah tersinkron dengan repositori Git.
            </p>
          </div>
          <div className="pt-1 flex items-center justify-between text-xs border-t border-[#27272a]/60">
            <span className="text-[#a1a1aa]">Rata-rata Nilai Tugas:</span>
            <span className="text-[#34d399] font-mono font-bold">
              {student.syncStatus.averageScore} / 100
            </span>
          </div>
        </div>
      </section>
    </main>
  );
};
