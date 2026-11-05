// Konfigurasi non-rahasia dari .env (aman ditampilkan di website).
export const APP_NAME: string = import.meta.env.VITE_APP_NAME ?? 'MyTask';
export const APP_VERSION: string = import.meta.env.VITE_APP_VERSION ?? '1.0.0';
