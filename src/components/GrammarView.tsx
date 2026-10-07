import React, { useState } from 'react';
import { GRAMMAR_LESSONS } from '../data/grammar';
import { QUESTIONS_BANK } from '../data/questions';
import { UserStats, Question } from '../types';
import { recordQuestionAttempt } from '../utils/analytics';
import { 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Check, 
  X, 
  HelpCircle,
  Sparkles,
  Layers,
  Clock,
  RotateCcw,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface GrammarViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  initialTopicId?: string;
}

export const GrammarView: React.FC<GrammarViewProps> = ({
  stats,
  onUpdateStats,
  initialTopicId
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopicId || 'grammar-multiword');
  const [activeTab, setActiveTab] = useState<'rules' | 'practice'>('rules');

  // Mini Practice state for the selected topic
  const practiceQuestions = QUESTIONS_BANK.filter(q => q.topic === selectedTopicId);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const currentLesson = GRAMMAR_LESSONS.find(l => l.topicId === selectedTopicId) || GRAMMAR_LESSONS[0];
  const currentQuestion: Question | undefined = practiceQuestions[currentQIndex];

  const handleSelectAnswer = (qId: string, option: string) => {
    if (userAnswers[qId]) return; // already answered
    const isCorrect = option.trim().toLowerCase() === currentQuestion?.answer.trim().toLowerCase();
    
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
    setShowExplanation(true);

    const updatedStats = recordQuestionAttempt(stats, qId, option, isCorrect);
    onUpdateStats(updatedStats);
  };

  const getTopicIcon = (topicId: string) => {
    switch (topicId) {
      case 'grammar-multiword': return <Layers size={18} />;
      case 'grammar-present-perf': return <Clock size={18} />;
      case 'grammar-used-to': return <RotateCcw size={18} />;
      case 'grammar-obligation': return <ShieldCheck size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">
          <BookOpen size={28} color="var(--primary-600)" />
          Grammar & Context Understanding
        </h1>
        <p className="page-subtitle">
          ทำความเข้าใจโครงสร้าง กฎเหล็ก และบริบทการเลือกใช้ตามเอกสาร Final Exam Review
        </p>
      </div>

      {/* Topic Selection Grid */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {GRAMMAR_LESSONS.map(lesson => (
          <div
            key={lesson.topicId}
            id={`grammar-tab-${lesson.topicId}`}
            onClick={() => {
              setSelectedTopicId(lesson.topicId);
              setCurrentQIndex(0);
              setShowExplanation(false);
            }}
            className="card"
            style={{
              cursor: 'pointer',
              borderColor: selectedTopicId === lesson.topicId ? 'var(--primary-600)' : 'var(--border-light)',
              backgroundColor: selectedTopicId === lesson.topicId ? 'var(--primary-50)' : 'var(--bg-card)',
              transition: 'all 0.2s ease',
              padding: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem', color: selectedTopicId === lesson.topicId ? 'var(--primary-600)' : 'var(--text-muted)' }}>
              {getTopicIcon(lesson.topicId)}
              <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{lesson.unit.toUpperCase()}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
              {lesson.titleEn.split('(')[0]}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {lesson.titleTh.split('(')[0]}
            </div>
          </div>
        ))}
      </div>

      {/* Mode Subtabs: Rules vs Mini Practice */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
        <button
          id="grammar-subtab-rules"
          className={`btn btn-sm ${activeTab === 'rules' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('rules')}
        >
          <BookOpen size={14} />
          Key Rules & Summaries
        </button>

        <button
          id="grammar-subtab-practice"
          className={`btn btn-sm ${activeTab === 'practice' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('practice')}
        >
          <Sparkles size={14} />
          Targeted Practice ({practiceQuestions.length} Questions)
        </button>
      </div>

      {activeTab === 'rules' ? (
        /* RULES AND SUMMARY VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Quick Summary Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-card), var(--bg-surface-elevated))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '0.25rem' }}>Quick Summary</span>
                <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-600)' }}>{currentLesson.titleEn}</h2>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{currentLesson.titleTh}</div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-input)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              marginBottom: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              color: 'var(--primary-600)',
              fontWeight: 600
            }}>
              FORM: {currentLesson.form}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>หลักการใช้งานสำคัญ (How to Use):</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{currentLesson.useEn}</p>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{currentLesson.useTh}</p>
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                SIGNAL CLUES & PATTERNS IN EXAM:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {currentLesson.signalClues.map((clue, idx) => (
                  <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                    {clue}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Deep Breakdown Rules */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <CheckCircle2 size={18} color="var(--success)" />
              โครงสร้างและตัวอย่างประโยคจริง (Rules & Real Examples)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {currentLesson.rules.map((rule, idx) => (
                <div key={idx} style={{ borderLeft: '3px solid var(--primary-500)', paddingLeft: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                    {rule.heading}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    {rule.explanationTh}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {rule.examples.map((ex, eIdx) => (
                      <div 
                        key={eIdx}
                        style={{
                          backgroundColor: 'var(--bg-input)',
                          padding: '0.6rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.875rem'
                        }}
                      >
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          • {ex.en}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                          ({ex.th})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Exam Traps */}
          {currentLesson.commonTraps.length > 0 && (
            <div className="card" style={{ borderColor: 'var(--warning-border)', backgroundColor: 'var(--warning-bg)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--warning-text)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <AlertTriangle size={18} color="var(--warning)" />
                Common Exam Traps • จุดหลอกที่คนมักเสียคะแนน
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {currentLesson.commonTraps.map((trap, idx) => (
                  <div 
                    key={idx}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--warning-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      ⚠️ {trap.trapTitleTh}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', marginBottom: '0.45rem' }}>
                      <div style={{ color: 'var(--danger-text)', fontWeight: 600 }}>
                        ❌ ตัวอย่างผิด: {trap.wrongExample}
                      </div>
                      <div style={{ color: 'var(--success-text)', fontWeight: 600 }}>
                        ✅ ตัวอย่างถูก: {trap.correctExample}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      💡 เหตุผล: {trap.reasonTh}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => setActiveTab('practice')}
            >
              ฝึกโจทย์ประจำหัวข้อนี้ทันที ({practiceQuestions.length} ข้อ)
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* TARGETED PRACTICE VIEW */
        <div>
          {practiceQuestions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <HelpCircle size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3>ยังไม่มีโจทย์สำหรับหัวข้อนี้</h3>
            </div>
          ) : currentQuestion && (
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>Question {currentQIndex + 1} of {practiceQuestions.length}</span>
                <span className="badge badge-neutral">{currentQuestion.difficulty.toUpperCase()}</span>
              </div>

              <div className="card">
                {currentQuestion.paragraphText && (
                  <div style={{
                    backgroundColor: 'var(--bg-input)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    marginBottom: '1rem',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic'
                  }}>
                    {currentQuestion.paragraphText}
                  </div>
                )}

                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {currentQuestion.question}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {currentQuestion.options.map((opt, i) => {
                    const answered = userAnswers[currentQuestion.id];
                    const isSelected = answered === opt;
                    const isCorrect = opt.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();

                    let btnClass = 'option-btn';
                    if (answered) {
                      if (isCorrect) btnClass += ' correct';
                      else if (isSelected && !isCorrect) btnClass += ' incorrect';
                    } else if (isSelected) {
                      btnClass += ' selected';
                    }

                    return (
                      <button
                        key={i}
                        className={btnClass}
                        disabled={!!answered}
                        onClick={() => handleSelectAnswer(currentQuestion.id, opt)}
                      >
                        <span>{opt}</span>
                        {answered && isCorrect && <Check size={18} color="var(--success)" />}
                        {answered && isSelected && !isCorrect && <X size={18} color="var(--danger)" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {userAnswers[currentQuestion.id] && (
                  <div className="explanation-box" style={{
                    borderLeft: `4px solid ${userAnswers[currentQuestion.id].trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase() ? 'var(--success)' : 'var(--danger)'}`
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem', color: userAnswers[currentQuestion.id].trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase() ? 'var(--success-text)' : 'var(--danger-text)' }}>
                      {userAnswers[currentQuestion.id].trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase() ? '✅ คำตอบถูกต้อง!' : `❌ ตอบผิด — คำตอบที่ถูกคือ: ${currentQuestion.answer}`}
                    </div>
                    
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      <strong>Why?</strong> {currentQuestion.explanationTh}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {currentQuestion.explanationEn}
                    </div>

                    {currentQuestion.trapWarning && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--warning-text)', fontWeight: 600 }}>
                        💡 จุดสังเกต: {currentQuestion.trapWarning}
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
                  <button
                    className="btn btn-secondary"
                    disabled={currentQIndex === 0}
                    onClick={() => {
                      setCurrentQIndex(prev => prev - 1);
                      setShowExplanation(false);
                    }}
                  >
                    ข้อก่อนหน้า
                  </button>

                  <button
                    className="btn btn-primary"
                    disabled={currentQIndex >= practiceQuestions.length - 1}
                    onClick={() => {
                      setCurrentQIndex(prev => prev + 1);
                      setShowExplanation(false);
                    }}
                  >
                    ข้อถัดไป
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
