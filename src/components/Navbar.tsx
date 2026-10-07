import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Languages, 
  GraduationCap, 
  FileCheck2, 
  AlertTriangle, 
  Flame, 
  Search, 
  Sun, 
  Moon,
  RotateCcw
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  mistakeCount: number;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  theme,
  setTheme,
  mistakeCount,
  onResetData
}) => {
  return (
    <header className="header-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div 
          onClick={() => setCurrentTab('dashboard')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            background: 'var(--primary-gradient)',
            color: '#fff',
            padding: '0.45rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px var(--primary-glow)'
          }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              English III <span style={{ color: 'var(--primary-600)', fontSize: '0.8rem', fontWeight: 700, padding: '2px 6px', background: 'var(--primary-50)', borderRadius: '4px', marginLeft: '4px' }}>EXAM TRAINER</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Final Exam Prep • Unit 3 & 4</div>
          </div>
        </div>
      </div>

      <nav className="nav-links">
        <button 
          id="nav-dashboard"
          className={`nav-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentTab('dashboard')}
        >
          <LayoutDashboard size={17} />
          <span>Dashboard</span>
        </button>

        <button 
          id="nav-vocab"
          className={`nav-btn ${currentTab === 'vocab' ? 'active' : ''}`}
          onClick={() => setCurrentTab('vocab')}
        >
          <Languages size={17} />
          <span>Vocabulary</span>
        </button>

        <button 
          id="nav-grammar"
          className={`nav-btn ${currentTab === 'grammar' ? 'active' : ''}`}
          onClick={() => setCurrentTab('grammar')}
        >
          <BookOpen size={17} />
          <span>Grammar</span>
        </button>

        <button 
          id="nav-mock"
          className={`nav-btn ${currentTab === 'mock' ? 'active' : ''}`}
          onClick={() => setCurrentTab('mock')}
        >
          <FileCheck2 size={17} />
          <span>Mock Exam</span>
        </button>

        <button 
          id="nav-weakness"
          className={`nav-btn ${currentTab === 'weakness' ? 'active' : ''}`}
          onClick={() => setCurrentTab('weakness')}
        >
          <Flame size={17} />
          <span>Weakness</span>
        </button>

        <button 
          id="nav-mistakes"
          className={`nav-btn ${currentTab === 'mistakes' ? 'active' : ''}`}
          onClick={() => setCurrentTab('mistakes')}
          style={{ position: 'relative' }}
        >
          <AlertTriangle size={17} />
          <span>Mistakes</span>
          {mistakeCount > 0 && (
            <span style={{
              background: 'var(--danger)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '1px 5px',
              borderRadius: '999px',
              marginLeft: '2px'
            }}>
              {mistakeCount}
            </span>
          )}
        </button>

        <button 
          id="nav-review"
          className={`nav-btn ${currentTab === 'review' ? 'active' : ''}`}
          onClick={() => setCurrentTab('review')}
        >
          <Search size={17} />
          <span>Quick Review</span>
        </button>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          title="Reset Study Data"
          onClick={onResetData}
          className="nav-btn"
          style={{ color: 'var(--text-muted)', padding: '0.45rem' }}
        >
          <RotateCcw size={16} />
        </button>

        <button
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="nav-btn"
          style={{ padding: '0.45rem' }}
        >
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </button>
      </div>
    </header>
  );
};
