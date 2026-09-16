import React, { useState, useEffect } from 'react';
import { ViewTab, Course, StudentProfile, TaskItem } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BerandaView } from './components/BerandaView';
import { ProfilView } from './components/ProfilView';
import { loadTasks, loadCourses, loadStudentProfile, submitTask } from './lib/supabase';

export default function App() {
  // 1. Cek URL saat pertama kali halaman dimuat
  const getInitialTab = (): ViewTab => {
    const path = window.location.pathname;
    if (path.includes('/profil')) return 'profil';
    return 'beranda';
  };

  const [currentTab, setCurrentTab] = useState<ViewTab>(getInitialTab());
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initData() {
      try {
        const [loadedTasks, loadedCourses, loadedProfile] = await Promise.all([
          loadTasks(),
          loadCourses(),
          loadStudentProfile(),
        ]);
        setTasks(loadedTasks);
        setCourses(loadedCourses);
        setStudent(loadedProfile);
      } catch (err) {
        console.error('Gagal memuat data awal', err);
      } finally {
        setIsLoading(false);
      }
    }
    initData();

    // 2. Menangani tombol Back / Forward pada browser
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('/profil')) {
        setCurrentTab('profil');
      } else {
        setCurrentTab('beranda');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 3. Fungsi ubah tab yang sekaligus mengubah URL browser
  const handleTabChange = (tab: ViewTab) => {
    setCurrentTab(tab);
    if (tab === 'profil') {
      window.history.pushState({}, '', '/profil');
    } else {
      window.history.pushState({}, '', '/');
    }
    // Scroll otomatis ke atas saat pindah halaman
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitTask = async (newTask: TaskItem, file: File | null) => {
    const savedTask = await submitTask(newTask, file);
    setTasks((prev) => [savedTask, ...prev.filter((t) => t.id !== savedTask.id)]);
  };

  const handleFillTaskForm = (task: TaskItem) => {
    setSelectedCourseCode(task.courseCode);
    handleTabChange('beranda');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex items-center justify-center">Memuat Portal MyTask...</div>;
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4 text-[#ef4444]">Data Mahasiswa Kosong</h1>
        <p className="text-[#a1a1aa] max-w-md">Harap tambahkan data mahasiswa di tabel <code>student_profiles</code> Supabase.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#fafafa] selection:bg-[#a78bfa]/30 selection:text-[#fafafa]">
      {/* Menggunakan handleTabChange pengganti fungsi lama */}
      <Header currentTab={currentTab} onTabChange={handleTabChange} student={student} />
      <div className="flex-1 w-full">
        {currentTab === 'beranda' ? (
          <BerandaView
            courses={courses}
            tasks={tasks}
            onSubmitTask={handleSubmitTask}
            onFillTaskForm={handleFillTaskForm}
            selectedCourseCode={selectedCourseCode}
            setSelectedCourseCode={setSelectedCourseCode}
          />
        ) : (
          <ProfilView student={student} courses={courses} />
        )}
      </div>
      <Footer />
    </div>
  );
}