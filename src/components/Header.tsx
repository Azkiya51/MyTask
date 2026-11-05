import React from 'react';
import { ViewTab, StudentProfile } from '../types';
import { Disc as DiscordIcon } from 'lucide-react';

interface HeaderProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  student: StudentProfile;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  student,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#27272a] bg-[#09090b]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-6 sm:gap-8">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => onTabChange('beranda')}
          >
            {/* Purple Icon Box matching Image 1 & Image 2 */}
            <div className="w-9 h-9 rounded-xl bg-[#a78bfa] flex items-center justify-center shadow-lg shadow-[#a78bfa]/20 transition-transform duration-200 group-hover:scale-105">
              <svg
                className="w-5 h-5 text-[#09090b]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-bold tracking-tight text-[#fafafa]">
                  My<span className="text-[#a78bfa]">Task</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]"></span>
              </div>
              <span className="text-[10px] tracking-wider uppercase text-[#a1a1aa] font-medium mt-1">
                Portal Tugas Mahasiswa
              </span>
            </div>
          </div>

          {/* HTML5 Navigation bar */}
          <nav aria-label="Main Navigation" className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => onTabChange('beranda')}
              className={`px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap ${
                currentTab === 'beranda'
                  ? 'bg-[#18181b] text-[#fafafa] border border-[#27272a] shadow-sm'
                  : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]/50'
              }`}
            >
              Beranda
            </button>
            <button
              type="button"
              onClick={() => onTabChange('profil')}
              className={`px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap ${
                currentTab === 'profil'
                  ? 'bg-[#18181b] text-[#fafafa] border border-[#27272a] shadow-sm'
                  : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]/50'
              }`}
            >
              Profil
            </button>
            <button
              type="button"
              onClick={() => onTabChange('pengelola')}
              className={`px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap ${
                currentTab === 'pengelola'
                  ? 'bg-[#18181b] text-[#fafafa] border border-[#27272a] shadow-sm'
                  : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]/50'
              }`}
            >
              Pengelola Tugas
            </button>
          </nav>
        </div>

        {/* Right: Actions & Student Status */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Gabung Discord button if on Profil tab */}
          {currentTab === 'profil' && (
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#fafafa] bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] transition-colors"
            >
              <DiscordIcon className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span>Gabung Discord</span>
            </a>
          )}

          {/* Student Status & Avatar */}
          <div 
            onClick={() => onTabChange('profil')}
            className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-[#27272a] cursor-pointer group"
          >
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-[#fafafa] group-hover:text-[#a78bfa] transition-colors">
                Mahasiswa Aktif
              </span>
              <div className="flex items-center justify-end gap-1.5 text-[10px] text-[#a1a1aa]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span>
                <span>Aktif - Semester {student.semester}</span>
              </div>
            </div>

            {/* Avatar */}
            <div className="relative">
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-[#27272a] group-hover:ring-[#a78bfa] transition-all"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#34d399] ring-2 ring-[#09090b]"></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
