import React, { useState, useEffect } from 'react';
import { UserStats } from './types';
import { loadUserStats, saveUserStats, resetUserStats } from './utils/analytics';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { VocabularyView } from './components/VocabularyView';
import { GrammarView } from './components/GrammarView';
import { MockExamView } from './components/MockExamView';
import { MistakesView } from './components/MistakesView';
import { WeaknessView } from './components/WeaknessView';
import { QuickReviewView } from './components/QuickReviewView';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [targetContextId, setTargetContextId] = useState<string | number | undefined>(undefined);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [stats, setStats] = useState<UserStats>(loadUserStats());

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('eng3_app_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('eng3_app_theme', newTheme);
  };

  const handleUpdateStats = (newStats: UserStats) => {
    setStats(newStats);
    saveUserStats(newStats);
  };

  const handleResetData = () => {
    if (window.confirm('⚠️ คุณต้องการรีเซ็ตข้อมูลความคืบหน้า คะแนน Mock Exam และข้อผิดทั้งหมดหรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้')) {
      resetUserStats();
      const fresh = loadUserStats();
      setStats(fresh);
      alert('รีเซ็ตข้อมูลการเรียนเรียบร้อยแล้ว');
    }
  };

  const handleNavigate = (tab: string, contextId?: string | number) => {
    setCurrentTab(tab);
    setTargetContextId(contextId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mistakeCount = Object.keys(stats.mistakes || {}).length;

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar 
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          theme={theme}
          setTheme={handleThemeChange}
          mistakeCount={mistakeCount}
          onResetData={handleResetData}
        />

        <main>
          {currentTab === 'dashboard' && (
            <DashboardView 
              stats={stats}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'vocab' && (
            <VocabularyView 
              stats={stats}
              onUpdateStats={handleUpdateStats}
              initialTopicId={typeof targetContextId === 'string' ? targetContextId : undefined}
            />
          )}

          {currentTab === 'grammar' && (
            <GrammarView 
              stats={stats}
              onUpdateStats={handleUpdateStats}
              initialTopicId={typeof targetContextId === 'string' ? targetContextId : undefined}
            />
          )}

          {currentTab === 'mock' && (
            <MockExamView 
              stats={stats}
              onUpdateStats={handleUpdateStats}
              initialMockId={typeof targetContextId === 'number' ? targetContextId : 1}
              onNavigateToStudy={(topicId) => handleNavigate(topicId.startsWith('vocab') ? 'vocab' : 'grammar', topicId)}
            />
          )}

          {currentTab === 'mistakes' && (
            <MistakesView 
              stats={stats}
              onUpdateStats={handleUpdateStats}
              onNavigateToStudy={(topicId) => handleNavigate(topicId.startsWith('vocab') ? 'vocab' : 'grammar', topicId)}
            />
          )}

          {currentTab === 'weakness' && (
            <WeaknessView 
              stats={stats}
              onNavigateToStudy={(topicId) => handleNavigate(topicId.startsWith('vocab') ? 'vocab' : 'grammar', topicId)}
              onNavigateToMock={() => handleNavigate('mock', 1)}
            />
          )}

          {currentTab === 'review' && (
            <QuickReviewView />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
