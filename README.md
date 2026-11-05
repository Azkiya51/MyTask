# MyTask • Portal Tugas Mahasiswa

Aplikasi web untuk mengumpulkan tugas kuliah, melihat jadwal dan profil mahasiswa, serta mengelola daftar tugas pribadi (tambah, ubah, hapus, dan tandai selesai). Dibangun dengan **React + Vite + TypeScript** dan menyimpan data di **Supabase**.

🔗 **Demo:** https://azkiyafauzan.my.id

---

## Daftar Isi
1. [Fitur](#fitur)
2. [Teknologi](#teknologi)
3. [Struktur Proyek](#struktur-proyek)
4. [Cara Menjalankan](#cara-menjalankan)
5. [Environment Variables](#environment-variables)
6. [Menyiapkan Supabase](#menyiapkan-supabase)
7. [npm, package.json, dan Semantic Versioning](#npm-packagejson-dan-semantic-versioning)
8. [Penggunaan TypeScript](#penggunaan-typescript)
9. [Git dan GitHub](#git-dan-github)
10. [Bukti Pengerjaan](#bukti-pengerjaan)
11. [Deploy](#deploy)

---

## Fitur

**Beranda**
- Formulir pengumpulan tugas (unggah file atau tautan GitHub) per mata kuliah
- Riwayat pengumpulan yang tersimpan di Supabase

**Pengelola Tugas** (menu baru di header)
- Menampilkan daftar tugas kuliah, diurutkan berdasarkan deadline
- Menambahkan tugas baru (judul, mata kuliah, deadline, prioritas, deskripsi)
- Mengedit dan menghapus tugas (hapus dengan konfirmasi)
- Status tugas **Belum Selesai / Selesai**, bisa diubah dengan sekali klik
- Filter berdasarkan status, statistik ringkas, dan penanda **Terlambat**

**Profil**
- Data mahasiswa dan mata kuliah dari Supabase

Tampilan bertema gelap (Obsidian High-Contrast), rapi, dan responsif di layar ponsel maupun desktop.

## Teknologi

| Bagian | Teknologi |
|---|---|
| Framework UI | React |
| Build tool | Vite |
| Bahasa | TypeScript |
| Styling | Tailwind CSS |
| Ikon | lucide-react |
| Database & Storage | Supabase (`@supabase/supabase-js`) |
| Hosting | Vercel |

## Struktur Proyek

```
MyTask/
├── public/
├── SS/                      # screenshot bukti pengerjaan
├── src/
│   ├── components/
│   │   ├── BerandaView.tsx
│   │   ├── PengelolaView.tsx    # menu Pengelola Tugas (CRUD)
│   │   ├── ProfilView.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   └── initialData.ts
│   ├── lib/
│   │   ├── supabase.ts          # klien Supabase + fungsi Beranda/Profil
│   │   ├── pengelolaApi.ts      # fungsi CRUD tugas_kuliah
│   │   ├── pengelolaTypes.ts    # interface, type alias, union, generics
│   │   └── appConfig.ts         # nama & versi aplikasi dari .env
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
├── .env                     # RAHASIA, tidak di-commit
├── .env.example             # contoh konfigurasi, aman di-commit
├── .gitignore
├── index.html
├── package.json
└── vercel.json
```

## Cara Menjalankan

Prasyarat: **Node.js** (disarankan versi LTS) dan **npm**.

```bash
# 1. Clone repository
git clone <URL-REPOSITORY-KAMU>
cd MyTask

# 2. Pasang dependensi
npm install

# 3. Siapkan environment variable
cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
# lalu isi nilai di dalam .env

# 4. Jalankan mode pengembangan
npm run dev

# 5. Build untuk produksi dan pratinjau hasilnya
npm run build
npm run preview
```

Alamat lokal akan tampil di terminal setelah `npm run dev` dijalankan.

## Environment Variables

Konfigurasi disimpan di file `.env` (tidak ikut ke GitHub). Salin dari `.env.example`:

| Variabel | Fungsi | Rahasia? |
|---|---|---|
| `VITE_SUPABASE_URL` | URL proyek Supabase | Tidak |
| `VITE_SUPABASE_ANON_KEY` | Anon public key Supabase | Tidak, dibatasi oleh RLS |
| `VITE_APP_NAME` | Nama aplikasi yang tampil di halaman | Tidak |
| `VITE_APP_VERSION` | Versi aplikasi yang tampil di halaman | Tidak |

Catatan keamanan:
- `.env` terdaftar di `.gitignore`, sedangkan `.env.example` hanya berisi placeholder.
- Variabel berawalan `VITE_` ikut masuk ke kode browser, jadi **jangan pernah** mengisinya dengan password atau `service_role key`.
- Keamanan data dijaga oleh *Row Level Security* (RLS) di Supabase, bukan dengan menyembunyikan anon key.

## Menyiapkan Supabase

1. Buat proyek di [supabase.com](https://supabase.com), lalu ambil **Project URL** dan **anon public key** dari *Project Settings → API*.
2. Buat tabel untuk fitur Pengelola Tugas dengan menjalankan SQL berikut di *SQL Editor*:

```sql
create table if not exists public.tugas_kuliah (
  id           uuid primary key default gen_random_uuid(),
  judul        text not null,
  mata_kuliah  text not null,
  deskripsi    text,
  deadline     date not null,
  prioritas    text not null default 'sedang' check (prioritas in ('rendah','sedang','tinggi')),
  status       text not null default 'belum_selesai' check (status in ('belum_selesai','selesai')),
  created_at   timestamptz not null default now()
);

alter table public.tugas_kuliah enable row level security;

create policy "anon boleh baca"   on public.tugas_kuliah for select to anon using (true);
create policy "anon boleh tambah" on public.tugas_kuliah for insert to anon with check (true);
create policy "anon boleh ubah"   on public.tugas_kuliah for update to anon using (true) with check (true);
create policy "anon boleh hapus"  on public.tugas_kuliah for delete to anon using (true);
```

3. Tabel lain yang dipakai halaman Beranda dan Profil: `submissions`, `courses`, `student_profiles`, serta bucket Storage `tugas_mahasiswa`.

> Kebijakan RLS di atas membuka akses publik karena aplikasi belum memakai login. Ini cukup untuk keperluan tugas kuliah, tetapi sebaiknya diganti dengan autentikasi bila dipakai sungguhan.

## npm, package.json, dan Semantic Versioning

- **npm** dipakai untuk memasang dan mengelola paket: `npm install <paket>` (dependency) dan `npm install -D <paket>` (devDependency).
- **`dependencies`** adalah paket yang dibutuhkan aplikasi saat berjalan, misalnya React, `@supabase/supabase-js`, dan `lucide-react`.
- **`devDependencies`** adalah paket yang hanya dibutuhkan saat pengembangan dan build, misalnya TypeScript, Vite, dan tipe `@types/*`.
- **`scripts`** di `package.json` adalah perintah pintas, dijalankan dengan `npm run <nama>`:

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan server pengembangan Vite |
| `npm run build` | Membuat versi produksi di folder `dist/` |
| `npm run preview` | Melihat hasil build secara lokal |

- **Semantic Versioning** memakai format `MAJOR.MINOR.PATCH`:
  - `MAJOR`: perubahan yang tidak kompatibel dengan versi lama
  - `MINOR`: penambahan fitur yang tetap kompatibel
  - `PATCH`: perbaikan bug
  - Contoh penulisan di `package.json`: `^1.4.2` berarti boleh naik ke `1.x.x` terbaru tetapi tidak ke `2.0.0`, sedangkan `~1.4.2` hanya boleh naik di level patch (`1.4.x`).

Versi pasti setiap paket dapat dilihat di `package.json` dan `package-lock.json`.

## Penggunaan TypeScript

Seluruh contoh yang diwajibkan tugas ada di `src/lib/pengelolaTypes.ts`:

| Konsep | Contoh di kode |
|---|---|
| Primitive types (`string`, `number`, `boolean`) | Field `judul: string`, `total: number`, `adaTerlambat: boolean` |
| Array | `DAFTAR_PRIORITAS: Prioritas[]`, `TugasKuliah[]` |
| Interface | `TugasKuliah`, `StatistikTugas`, `HasilOperasi<T>` |
| Type alias | `TugasInput = Omit<TugasKuliah, 'id' \| 'createdAt'>` |
| Union type | `StatusTugas = 'belum_selesai' \| 'selesai'`, `Prioritas`, `FilterStatus` |
| Generics | `HasilOperasi<T>` dan fungsi `kelompokkan<T, K extends string>()` |

## Git dan GitHub

- Repository di GitHub dengan `.gitignore` (mengabaikan `node_modules`, `dist`, dan `.env`)
- Lebih dari 5 commit (total 11 commit pada branch `main`)
- Lebih dari 2 branch: `main`, `MenuTugas`, `fix/judul-halaman`, `style/judul-halaman`
- Merge branch ke `main`, termasuk latihan **merge conflict** pada `PengelolaView.tsx` yang diselesaikan secara manual
- `git push` dan `git pull` ke `origin`
- Pull Request #1 yang di-merge ke `main`

Alur singkat yang dipakai:

```bash
git switch -c fix/judul-halaman      # buat dan pindah branch
git commit -am "fix: ubah judul halaman"
git switch main
git merge fix/judul-halaman          # merge ke main
git push origin main                 # kirim ke GitHub
git pull origin main                 # ambil perubahan terbaru
```

## Bukti Pengerjaan

**1. Merge conflict terjadi saat `git merge`** (penanda `<<<<<<<` dan `>>>>>>>` pada `PengelolaView.tsx`)

<img src="SS/bukti-1-merge-conflict.png" alt="Merge conflict di VS Code" width="800">

**2. Graph commit, merge conflict yang sudah diselesaikan, dan Pull Request #1**, bersama daftar branch

<img src="SS/bukti-2-graph-dan-branch.png" alt="Git graph dan daftar branch" width="800">

**3. Jumlah total commit** (`git rev-list --count HEAD` menghasilkan 11)

<img src="SS/bukti-3-jumlah-commit.png" alt="Jumlah commit" width="800">

## Deploy

Aplikasi di-deploy ke **Vercel** dan dapat dibuka di https://azkiyafauzan.my.id.

- Isi `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_APP_NAME`, dan `VITE_APP_VERSION` di *Project Settings → Environment Variables* pada Vercel (bukan lewat file `.env`).
- `vercel.json` mengarahkan semua path (misalnya `/profil` dan `/pengelola`) ke `index.html` agar routing sisi klien berjalan:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

Dibuat oleh **Azkiya Fauzan** untuk tugas mata kuliah PAW.
