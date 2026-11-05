// =====================================================================
// Tipe data untuk fitur "Pengelola Tugas"
// Berisi contoh: primitive types, array, interface, type alias,
// union type, dan generics sederhana (syarat tugas poin 4).
// =====================================================================

/** Union type: status hanya boleh salah satu dari dua nilai ini. */
export type StatusTugas = 'belum_selesai' | 'selesai';

/** Union type: tingkat prioritas tugas. */
export type Prioritas = 'rendah' | 'sedang' | 'tinggi';

/** Type alias + union: filter di daftar tugas. */
export type FilterStatus = 'semua' | StatusTugas;

/** Interface utama: bentuk 1 data tugas kuliah. */
export interface TugasKuliah {
  id: string; // primitive: string
  judul: string;
  mataKuliah: string;
  deskripsi: string;
  deadline: string; // format YYYY-MM-DD
  prioritas: Prioritas;
  status: StatusTugas;
  createdAt: string;
}

/** Type alias: data yang diisi user saat tambah/edit (tanpa id & createdAt). */
export type TugasInput = Omit<TugasKuliah, 'id' | 'createdAt'>;

/** Interface untuk ringkasan statistik (primitive number & boolean). */
export interface StatistikTugas {
  total: number;
  selesai: number;
  belumSelesai: number;
  persenSelesai: number;
  adaTerlambat: boolean;
}

/** Interface generic: pembungkus hasil operasi, T bisa tipe apa saja. */
export interface HasilOperasi<T> {
  data: T | null;
  pesanError: string | null;
}

/** Array of interface: contoh pemakaian array bertipe. */
export const DAFTAR_PRIORITAS: Prioritas[] = ['rendah', 'sedang', 'tinggi'];

export const LABEL_STATUS: Record<StatusTugas, string> = {
  belum_selesai: 'Belum Selesai',
  selesai: 'Selesai',
};

/** Generic function: kelompokkan array apa pun berdasarkan sebuah kunci. */
export function kelompokkan<T, K extends string>(
  items: T[],
  ambilKunci: (item: T) => K,
): Record<K, T[]> {
  const hasil = {} as Record<K, T[]>;
  for (const item of items) {
    const kunci = ambilKunci(item);
    (hasil[kunci] ??= []).push(item);
  }
  return hasil;
}

/** Cek apakah tugas lewat deadline dan belum selesai. */
export function isTerlambat(tugas: TugasKuliah, hariIni: Date = new Date()): boolean {
  if (tugas.status === 'selesai' || !tugas.deadline) return false;
  const batas = new Date(`${tugas.deadline}T23:59:59`);
  return batas.getTime() < hariIni.getTime();
}

/** Hitung statistik dari array tugas. */
export function hitungStatistik(daftar: TugasKuliah[]): StatistikTugas {
  const total: number = daftar.length;
  const selesai: number = daftar.filter((t) => t.status === 'selesai').length;
  return {
    total,
    selesai,
    belumSelesai: total - selesai,
    persenSelesai: total === 0 ? 0 : Math.round((selesai / total) * 100),
    adaTerlambat: daftar.some((t) => isTerlambat(t)),
  };
}
