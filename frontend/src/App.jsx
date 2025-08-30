import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DocbotChat from './components/DocbotChat/DocbotChat';
import ProcedureMode from './components/ProcedureMode';
import QuizModule from './components/QuizModule/QuizModule';
import ManagerDashboard from './components/ManagerDashboard';
import Ingestion from './components/Ingestion/Ingestion';






// ---------- App ----------
function AppContent() {
  const [view, setView] = useState('chat'); // chat | procedure | quiz | dashboard | ingest
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    function onOnline() { setOffline(false); }
    function onOffline() { setOffline(true); }
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header offline={offline} />
      <div className="w-full p-4 flex gap-4">
        <Sidebar view={view} setView={setView} />
        <main className="flex-1 min-w-0 bg-white rounded-2xl shadow p-6">
          <motion.div key={view} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {view === 'chat' && <DocbotChat />}
            {view === 'procedure' && <ProcedureMode />}
            {view === 'quiz' && <QuizModule />}
            {view === 'dashboard' && <ManagerDashboard />}
            {view === 'ingest' && <Ingestion />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  );
}



