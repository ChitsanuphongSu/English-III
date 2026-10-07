import React, { useState } from 'react';
import { UserStats, Question } from '../types';
import { QUESTIONS_BANK } from '../data/questions';
import { recordQuestionAttempt } from '../utils/analytics';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Check, 
  X, 
  RotateCcw, 
  Trash2, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface MistakesViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onNavigateToStudy: (topicId: string) => void;
}

export const MistakesView: React.FC<MistakesViewProps> = ({
  stats,
  onUpdateStats,
  onNavigateToStudy
}) => {
  const mistakesList = Object.values(stats.mistakes || {});
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});

  const filteredMistakes = mistakesList.filter(m => {
    if (selectedTopic === 'all') return true;
    return m.topic === selectedTopic;
  });

  const handleRetryQuestion = (qId: string, option: string) => {
    const qObj = QUESTIONS_BANK.find(q => q.id === qId);
    if (!qObj) return;

    const isCorrect = option.trim().toLowerCase() === qObj.answer.trim().toLowerCase();
    setPracticeAnswers(prev => ({ ...prev, [qId]: option }));

    const updatedStats = recordQuestionAttempt(stats, qId, option, isCorrect);
    onUpdateStats(updatedStats);
  };

  const handleClearAllMistakes = () => {
    if (window.confirm('คุณต้องการล้างรายการข้อผิดพลาดทั้งหมดหรือไม่?')) {
      const newStats = { ...stats, mistakes: {} };
      onUpdateStats(newStats);
    }
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">
            <AlertTriangle size={28} color="var(--danger)" />
            My Mistakes Review Notebook
          </h1>
          <p className="page-subtitle">
            สมุดจดบันทึกข้อที่เคยทำผิด เพื่อฝึกซ้ำจนกว่าจะไม่เสียคะแนนในข้อสอบจริง
          </p>
        </div>

        {mistakesList.length > 0 && (
          <button 
            className="btn btn-outline btn-sm"
            onClick={handleClearAllMistakes}
          >
            <Trash2 size={14} />
            ล้างประวัติข้อผิด
          </button>
        )}
      </div>

      {mistakesList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>ยอดเยี่ยมมาก! ไม่มีข้อผิดค้างอยู่ในระบบ</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.25rem auto' }}>
            ข้อผิดพลาดที่เกิดขึ้นจากการทำ Mock Exam หรือแบบฝึกหัดจะถูกรวบรวมมาไว้ที่นี่อัตโนมัติ
          </p>
        </div>
      ) : (
        <div>
          {/* Summary Box */}
          <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--danger-bg)', borderColor: 'var(--danger-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--danger-text)' }}>
                  คุณมีโจทย์ที่ต้องฝึกซ้ำทั้งหมด {mistakesList.length} ข้อ
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  เมื่อคุณตอบถูกในการฝึกซ้ำ ข้อนั้นจะถูกอัปเดตและปลดล็อคออกจากสมุดข้อผิดอัตโนมัติ
                </div>
              </div>
            </div>
          </div>

          {/* List of Mistakes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredMistakes.map(m => {
              const qObj = QUESTIONS_BANK.find(q => q.id === m.questionId);
              if (!qObj) return null;

              const currentAns = practiceAnswers[m.questionId];
              const isResolved = currentAns?.trim().toLowerCase() === qObj.answer.trim().toLowerCase();

              return (
                <div key={m.questionId} className="card" style={{ borderLeft: `4px solid ${isResolved ? 'var(--success)' : 'var(--danger)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span className="badge badge-info">{qObj.unit.toUpperCase()}</span>
                      <span className="badge badge-neutral">{qObj.subtopic}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--danger-text)', fontWeight: 700 }}>
                      ผิดไป {m.timesWrong} ครั้ง
                    </span>
                  </div>

                  {qObj.paragraphText && (
                    <div style={{
                      backgroundColor: 'var(--bg-input)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      marginBottom: '0.75rem',
                      fontStyle: 'italic'
                    }}>
                      {qObj.paragraphText}
                    </div>
                  )}

                  <h3 style={{ fontSize: '1.05rem', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                    {qObj.question}
                  </h3>

                  {/* Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.75rem' }}>
                    {qObj.options.map((opt, i) => {
                      const isSelected = currentAns === opt;
                      const isCorrectOpt = opt.trim().toLowerCase() === qObj.answer.trim().toLowerCase();

                      let btnClass = 'option-btn';
                      if (currentAns) {
                        if (isCorrectOpt) btnClass += ' correct';
                        else if (isSelected && !isCorrectOpt) btnClass += ' incorrect';
                      }

                      return (
                        <button
                          key={i}
                          className={btnClass}
                          onClick={() => handleRetryQuestion(m.questionId, opt)}
                        >
                          <span>{opt}</span>
                          {currentAns && isCorrectOpt && <Check size={16} color="var(--success)" />}
                          {currentAns && isSelected && !isCorrectOpt && <X size={16} color="var(--danger)" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation and Trap Warning */}
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    border: '1px solid var(--border-light)'
                  }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      💡 คำอธิบายเฉลย:
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      {qObj.explanationTh}
                    </div>
                    {qObj.trapWarning && (
                      <div style={{ color: 'var(--warning-text)', fontWeight: 600, fontSize: '0.8rem' }}>
                        ⚠️ จุดระวัง: {qObj.trapWarning}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
