import { getSupabase } from './supabase';
import type { Prioritas, StatusTugas, TugasInput, TugasKuliah } from './pengelolaTypes';

const TABEL = 'tugas_kuliah';

/** Ambil klien Supabase yang sudah ada; lempar error jika .env belum diisi. */
function db() {
  const client = getSupabase();
  if (!client) throw new Error('Klien Supabase belum siap. Periksa VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY di .env.');
  return client;
}

/** Bentuk baris di database (snake_case). */
interface BarisTugas {
  id: string;
  judul: string;
  mata_kuliah: string;
  deskripsi: string | null;
  deadline: string;
  prioritas: Prioritas;
  status: StatusTugas;
  created_at: string;
}

const dariBaris = (b: BarisTugas): TugasKuliah => ({
  id: b.id,
  judul: b.judul,
  mataKuliah: b.mata_kuliah,
  deskripsi: b.deskripsi ?? '',
  deadline: b.deadline,
  prioritas: b.prioritas,
  status: b.status,
  createdAt: b.created_at,
});

const keBaris = (t: Partial<TugasInput>): Record<string, unknown> => {
  const baris: Record<string, unknown> = {};
  if (t.judul !== undefined) baris.judul = t.judul;
  if (t.mataKuliah !== undefined) baris.mata_kuliah = t.mataKuliah;
  if (t.deskripsi !== undefined) baris.deskripsi = t.deskripsi;
  if (t.deadline !== undefined) baris.deadline = t.deadline;
  if (t.prioritas !== undefined) baris.prioritas = t.prioritas;
  if (t.status !== undefined) baris.status = t.status;
  return baris;
};

// READ
export async function ambilSemuaTugas(): Promise<TugasKuliah[]> {
  const { data, error } = await db()
    .from(TABEL)
    .select('*')
    .order('deadline', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as BarisTugas[]).map(dariBaris);
}

// CREATE
export async function buatTugas(input: TugasInput): Promise<TugasKuliah> {
  const { data, error } = await db().from(TABEL).insert(keBaris(input)).select().single();
  if (error) throw new Error(error.message);
  return dariBaris(data as BarisTugas);
}

// UPDATE
export async function ubahTugas(id: string, input: Partial<TugasInput>): Promise<TugasKuliah> {
  const { data, error } = await db()
    .from(TABEL)
    .update(keBaris(input))
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return dariBaris(data as BarisTugas);
}

// DELETE
export async function hapusTugas(id: string): Promise<void> {
  const { error } = await db().from(TABEL).delete().eq('id', id);
  if (error) throw new Error(error.message);
}
