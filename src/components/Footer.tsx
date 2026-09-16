import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#27272a] bg-[#09090b] px-4 sm:px-6 lg:px-8 py-4 mt-12 text-xs text-[#a1a1aa]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left info */}
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[#fafafa] font-medium">MyTask Core</span>
          <span>•</span>
          <span>Tahun Akademik 2023/2024 Genap</span>
        </div>

        {/* Right info & live indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-[#34d399]">
            <span className="w-2 h-2 rounded-full bg-[#34d399]" />
            <span>Sistem Terhubung</span>
          </div>
          <span>•</span>
          <span>© 2024 Portal Pengumpulan Tugas</span>
        </div>
      </div>
    </footer>
  );
};
