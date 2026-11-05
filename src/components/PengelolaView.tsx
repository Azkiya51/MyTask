import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Circle,
  ClipboardList,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { Course } from '../types';
import {
  DAFTAR_PRIORITAS,
  FilterStatus,
  LABEL_STATUS,
  Prioritas,
  TugasInput,
  TugasKuliah,
  hitungStatistik,
  isTerlambat,
  kelompokkan,
} from '../lib/pengelolaTypes';
import { ambilSemuaTugas, buatTugas, hapusTugas, ubahTugas } from '../lib/pengelolaApi';
import { APP_NAME, APP_VERSION } from '../lib/appConfig';

interface PengelolaViewProps {
  courses: Course[];
}

const FORM_KOSONG: TugasInput = {
  judul: '',
  mataKuliah: '',
  deskripsi: '',
  deadline: '',
  prioritas: 'sedang',
  status: 'belum_selesai',
};

const WARNA_PRIORITAS: Record<Prioritas, string> = {
  rendah: 'text-[#a1a1aa] border-[#27272a] bg-[#18181b]',
  sedang: 'text-[#fbbf24] border-[#fbbf24]/20 bg-[#fbbf24]/10',
  tinggi: 'text-[#f87171] border-[#f87171]/20 bg-[#f87171]/10',
};

const inputClass =
  'w-full bg-[#121215] border border-[#27272a] rounded-lg px-3.5 py-2.5 text-xs text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]';
const labelClass = 'block text-xs font-semibold tracking-wider text-[#a1a1aa] mb-2';

const formatTanggal = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const PengelolaView: React.FC<PengelolaViewProps> = ({ courses }) => {
  const [daftarTugas, setDaftarTugas] = useState<TugasKuliah[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filter, setFilter] = useState<FilterStatus>('semua');

  const [form, setForm] = useState<TugasInput>(FORM_KOSONG);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // READ: ambil data saat halaman dibuka
  useEffect(() => {
    ambilSemuaTugas()
      .then(setDaftarTugas)
      .catch((err: Error) => setErrorMessage(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const statistik = useMemo(() => hitungStatistik(daftarTugas), [daftarTugas]);

  const tugasTampil = useMemo(
    () => (filter === 'semua' ? daftarTugas : daftarTugas.filter((t) => t.status === filter)),
    [daftarTugas, filter],
  );

  // Contoh pemakaian generic function kelompokkan<T, K>()
  const perStatus = useMemo(() => kelompokkan(daftarTugas, (t) => t.status), [daftarTugas]);
  const jumlahBelum = perStatus.belum_selesai?.length ?? 0;

  const updateForm = <K extends keyof TugasInput>(key: K, value: TugasInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm(FORM_KOSONG);
    setEditingId(null);
  };

  // CREATE & UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!form.judul.trim()) return setErrorMessage('Judul tugas wajib diisi.');
    if (!form.mataKuliah.trim()) return setErrorMessage('Mata kuliah wajib diisi.');
    if (!form.deadline) return setErrorMessage('Deadline wajib diisi.');

    setIsSaving(true);
    try {
      const payload: TugasInput = {
        ...form,
        judul: form.judul.trim(),
        mataKuliah: form.mataKuliah.trim(),
        deskripsi: form.deskripsi.trim(),
      };

      if (editingId) {
        const diperbarui = await ubahTugas(editingId, payload);
        setDaftarTugas((prev) => prev.map((t) => (t.id === editingId ? diperbarui : t)));
      } else {
        const baru = await buatTugas(payload);
        setDaftarTugas((prev) =>
          [...prev, baru].sort((a, b) => a.deadline.localeCompare(b.deadline)),
        );
      }
      resetForm();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Gagal menyimpan tugas.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (tugas: TugasKuliah) => {
    setEditingId(tugas.id);
    setForm({
      judul: tugas.judul,
      mataKuliah: tugas.mataKuliah,
      deskripsi: tugas.deskripsi,
      deadline: tugas.deadline,
      prioritas: tugas.prioritas,
      status: tugas.status,
    });
    document.getElementById('form-pengelola')?.scrollIntoView({ behavior: 'smooth' });
  };

  // UPDATE status (centang / batal centang)
  const handleToggleStatus = async (tugas: TugasKuliah) => {
    setErrorMessage('');
    const statusBaru = tugas.status === 'selesai' ? 'belum_selesai' : 'selesai';
    try {
      const diperbarui = await ubahTugas(tugas.id, { status: statusBaru });
      setDaftarTugas((prev) => prev.map((t) => (t.id === tugas.id ? diperbarui : t)));
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Gagal mengubah status.');
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    setErrorMessage('');
    try {
      await hapusTugas(id);
      setDaftarTugas((prev) => prev.filter((t) => t.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Gagal menghapus tugas.');
    } finally {
      setDeletingId(null);
    }
  };

  const filterOptions: { value: FilterStatus; label: string }[] = [
    { value: 'semua', label: `Semua (${statistik.total})` },
    { value: 'belum_selesai', label: `Belum Selesai (${jumlahBelum})` },
    { value: 'selesai', label: `Selesai (${statistik.selesai})` },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Judul & statistik */}
      <section aria-labelledby="pengelola-title" className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 id="pengelola-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-[#fafafa]">
              Pengelola Tugas
            </h1>
            <p className="text-xs text-[#a1a1aa] mt-2 max-w-xl leading-relaxed">
              Catat tugas kuliahmu, atur deadline, dan tandai yang sudah selesai.
              <span className="text-[#71717a]"> {APP_NAME} v{APP_VERSION}</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-[#0c0c0f] border border-[#27272a] rounded-xl px-4 py-3 min-w-[96px]">
              <span className="block text-[11px] text-[#a1a1aa] font-medium">Total</span>
              <div className="text-xl sm:text-2xl font-bold text-[#fafafa] mt-1 font-mono">{statistik.total}</div>
            </div>
            <div className="bg-[#0c0c0f] border border-[#27272a] rounded-xl px-4 py-3 min-w-[96px]">
              <span className="block text-[11px] text-[#a1a1aa] font-medium">Selesai</span>
              <div className="text-xl sm:text-2xl font-bold text-[#34d399] mt-1 font-mono">
                {statistik.selesai}
                <span className="text-[#a1a1aa] text-base font-normal"> ({statistik.persenSelesai}%)</span>
              </div>
            </div>
            <div className="bg-[#0c0c0f] border border-[#27272a] rounded-xl px-4 py-3 min-w-[96px]">
              <span className="block text-[11px] text-[#a1a1aa] font-medium">Belum</span>
              <div
                className={`text-xl sm:text-2xl font-bold mt-1 font-mono ${
                  statistik.adaTerlambat ? 'text-[#f87171]' : 'text-[#a78bfa]'
                }`}
              >
                {statistik.belumSelesai}
              </div>
            </div>
          </div>
        </div>
      </section>

      {errorMessage && (
        <div role="alert" className="p-3.5 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* FORM TAMBAH / EDIT */}
        <section id="form-pengelola" aria-labelledby="form-pengelola-heading" className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-[#0c0c0f] border border-[#27272a] rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#a78bfa]/40 to-transparent" />

            <div className="flex items-center justify-between pb-4 border-b border-[#27272a] mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa]">
                  {editingId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <h2 id="form-pengelola-heading" className="text-sm sm:text-base font-semibold text-[#fafafa]">
                  {editingId ? 'Edit Tugas' : 'Tambah Tugas Baru'}
                </h2>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-1 text-[11px] text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Batal
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="judul" className={labelClass}>Judul tugas <span className="text-[#a78bfa]">*</span></label>
                <input id="judul" type="text" value={form.judul} onChange={(e) => updateForm('judul', e.target.value)}
                  placeholder="Misal: Laporan Praktikum Basis Data" className={inputClass} />
              </div>

              <div>
                <label htmlFor="matkul" className={labelClass}>Mata kuliah <span className="text-[#a78bfa]">*</span></label>
                <input id="matkul" type="text" list="daftar-matkul" value={form.mataKuliah}
                  onChange={(e) => updateForm('mataKuliah', e.target.value)}
                  placeholder="Pilih atau ketik mata kuliah" className={inputClass} />
                <datalist id="daftar-matkul">
                  {courses.map((c) => (
                    <option key={c.code} value={c.name} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="deadline" className={labelClass}>Deadline <span className="text-[#a78bfa]">*</span></label>
                  <input id="deadline" type="date" value={form.deadline}
                    onChange={(e) => updateForm('deadline', e.target.value)}
                    className={`${inputClass} [color-scheme:dark]`} />
                </div>
                <div>
                  <label htmlFor="prioritas" className={labelClass}>Prioritas</label>
                  <select id="prioritas" value={form.prioritas}
                    onChange={(e) => updateForm('prioritas', e.target.value as Prioritas)}
                    className={`${inputClass} cursor-pointer capitalize`}>
                    {DAFTAR_PRIORITAS.map((p) => (
                      <option key={p} value={p} className="bg-[#121215] capitalize">{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="deskripsi" className={labelClass}>Deskripsi <span className="text-[10px] text-[#71717a]">(opsional)</span></label>
                <textarea id="deskripsi" rows={3} value={form.deskripsi}
                  onChange={(e) => updateForm('deskripsi', e.target.value)}
                  placeholder="Detail tugas, ketentuan, atau catatan…" className={inputClass} />
              </div>

              {editingId && (
                <div>
                  <span className={labelClass}>Status</span>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-[#121215] border border-[#27272a] rounded-lg">
                    {(['belum_selesai', 'selesai'] as const).map((s) => (
                      <button key={s} type="button" onClick={() => updateForm('status', s)}
                        className={`py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                          form.status === s
                            ? 'bg-[#18181b] text-[#fafafa] border border-[#27272a] shadow-sm'
                            : 'text-[#a1a1aa] hover:text-[#fafafa]'
                        }`}>
                        {LABEL_STATUS[s]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" disabled={isSaving}
                className="w-full px-6 py-2.5 rounded-lg bg-[#a78bfa] hover:bg-[#906df8] text-[#09090b] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer">
                {isSaving ? (
                  <div className="w-3.5 h-3.5 border-2 border-[#09090b] border-t-transparent rounded-full animate-spin" />
                ) : editingId ? (
                  <><Save className="w-3.5 h-3.5" /><span>Simpan Perubahan</span></>
                ) : (
                  <><Plus className="w-3.5 h-3.5" /><span>Tambah Tugas</span></>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* DAFTAR TUGAS */}
        <section aria-labelledby="daftar-heading" className="lg:col-span-7">
          <div className="bg-[#0c0c0f] border border-[#27272a] rounded-xl p-5 sm:p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa]">
                  <ClipboardList className="w-4 h-4" />
                </div>
<<<<<<< HEAD
                <h2 id="daftar-heading" className="text-sm sm:text-base font-semibold text-[#fafafa]">Daftar Tugas</h2>
=======
                <h2 id="daftar-heading" className="text-sm sm:text-base font-semibold text-[#fafafa]">Daftar Tugas Kuliah</h2>
>>>>>>> fix/judul-halaman
              </div>
              <span className="text-xs text-[#a1a1aa] font-mono">{tugasTampil.length} tampil</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs" role="tablist" aria-label="Filter status">
              {filterOptions.map((opt) => (
                <button key={opt.value} type="button" role="tab" aria-selected={filter === opt.value}
                  onClick={() => setFilter(opt.value)}
                  className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    filter === opt.value
                      ? 'bg-[#18181b] text-[#fafafa] border border-[#27272a]'
                      : 'text-[#a1a1aa] hover:text-[#fafafa]'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-10 text-xs text-[#a1a1aa]">Memuat tugas…</div>
              ) : tugasTampil.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#a1a1aa]">
                  {daftarTugas.length === 0
                    ? 'Belum ada tugas. Tambahkan yang pertama lewat formulir.'
                    : 'Tidak ada tugas pada filter ini.'}
                </div>
              ) : (
                tugasTampil.map((t) => {
                  const selesai = t.status === 'selesai';
                  const terlambat = isTerlambat(t);
                  return (
                    <article key={t.id}
                      className={`p-3.5 rounded-lg bg-[#121215] border transition-colors ${
                        editingId === t.id ? 'border-[#a78bfa]' : 'border-[#27272a] hover:border-[#a78bfa]/40'
                      }`}>
                      <div className="flex items-start gap-3">
                        <button type="button" onClick={() => handleToggleStatus(t)}
                          aria-label={selesai ? 'Tandai belum selesai' : 'Tandai selesai'}
                          className="mt-0.5 shrink-0 cursor-pointer">
                          {selesai ? (
                            <CheckCircle2 className="w-5 h-5 text-[#34d399]" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#71717a] hover:text-[#a78bfa]" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <h3 className={`text-xs sm:text-sm font-semibold leading-snug ${
                              selesai ? 'line-through text-[#71717a]' : 'text-[#fafafa]'
                            }`}>
                              {t.judul}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${WARNA_PRIORITAS[t.prioritas]}`}>
                              {t.prioritas}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#a1a1aa]">{t.mataKuliah}</p>
                          {t.deskripsi && (
                            <p className="text-[11px] text-[#71717a] leading-relaxed break-words">{t.deskripsi}</p>
                          )}

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] pt-1">
                            <span className={`flex items-center gap-1 ${terlambat ? 'text-[#f87171]' : 'text-[#a1a1aa]'}`}>
                              <CalendarDays className="w-3 h-3" />
                              {formatTanggal(t.deadline)}
                              {terlambat && ' • Terlambat'}
                            </span>
                            <span className={`font-medium ${selesai ? 'text-[#34d399]' : 'text-[#a78bfa]'}`}>
                              {LABEL_STATUS[t.status]}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {deletingId === t.id ? (
                            <>
                              <button type="button" onClick={() => handleDelete(t.id)}
                                className="px-2 py-1 rounded-md text-[11px] font-medium bg-[#ef4444] text-[#fafafa] cursor-pointer">
                                Hapus
                              </button>
                              <button type="button" onClick={() => setDeletingId(null)}
                                className="px-2 py-1 rounded-md text-[11px] text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer">
                                Batal
                              </button>
                            </>
                          ) : (
                            <>
                              <button type="button" onClick={() => handleEdit(t)} aria-label={`Edit ${t.judul}`}
                                className="p-1.5 rounded-md text-[#a1a1aa] hover:text-[#a78bfa] hover:bg-[#18181b] cursor-pointer">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button type="button" onClick={() => setDeletingId(t.id)} aria-label={`Hapus ${t.judul}`}
                                className="p-1.5 rounded-md text-[#a1a1aa] hover:text-[#ef4444] hover:bg-[#18181b] cursor-pointer">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
