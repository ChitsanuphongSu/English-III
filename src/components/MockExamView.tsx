import React, { useState, useEffect } from 'react';
import { MOCK_EXAMS, getQuestionsForMock } from '../data/mockExams';
import { UserStats, MockExamAttempt, Question } from '../types';
import { recordMockSubmission } from '../utils/analytics';
import confetti from 'canvas-confetti';
import { 
  FileCheck2, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw,
  Flag,
  Award,
  BookOpen,
  TrendingUp,
  Check,
  X
} from 'lucide-react';

interface MockExamViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  initialMockId?: number;
  onNavigateToStudy: (topicId: string) => void;
}

export const MockExamView: React.FC<MockExamViewProps> = ({
  stats,
  onUpdateStats,
  initialMockId,
  onNavigateToStudy
}) => {
  const [selectedMockId, setSelectedMockId] = useState<number>(initialMockId || 1);
  const [isExamRunning, setIsExamRunning] = useState<boolean>(false);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);

  // Active Exam State
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [lastAttemptResult, setLastAttemptResult] = useState<MockExamAttempt | null>(null);

  const activeMock = MOCK_EXAMS.find(m => m.id === selectedMockId) || MOCK_EXAMS[0];
  const questions: Question[] = getQuestionsForMock(selectedMockId) as Question[];
  const currentQuestion: Question | undefined = questions[currentQIndex];

  // Timer Effect
  useEffect(() => {
    let timer: any;
    if (isExamRunning && secondsRemaining > 0 && !examSubmitted) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamRunning, secondsRemaining, examSubmitted]);

  const handleStartExam = (mockId: number) => {
    setSelectedMockId(mockId);
    const targetMock = MOCK_EXAMS.find(m => m.id === mockId) || MOCK_EXAMS[0];
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentQIndex(0);
    setExamSubmitted(false);
    setLastAttemptResult(null);
    setSecondsRemaining(targetMock.timeLimitMinutes * 60);
    setIsExamRunning(true);
  };

  const handleSelectOption = (qId: string, option: string) => {
    if (examSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const toggleFlag = (qId: string) => {
    setFlaggedQuestions(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitExam = () => {
    if (examSubmitted) return;
    setIsExamRunning(false);
    setExamSubmitted(true);

    let correctCount = 0;
    const topicBreakdown: any = {};
    const categoryBreakdown: any = { 
      Vocabulary: { total: 0, correct: 0, percentage: 0 }, 
      Grammar: { total: 0, correct: 0, percentage: 0 }, 
      Context: { total: 0, correct: 0, percentage: 0 } 
    };

    questions.forEach(q => {
      const isCorrect = userAnswers[q.id]?.trim().toLowerCase() === q.answer.trim().toLowerCase();
      if (isCorrect) correctCount++;

      // Topic Breakdown
      if (!topicBreakdown[q.topic]) {
        topicBreakdown[q.topic] = { total: 0, correct: 0, percentage: 0 };
      }
      topicBreakdown[q.topic].total++;
      if (isCorrect) topicBreakdown[q.topic].correct++;

      // Category Breakdown: Vocabulary vs Grammar
      if (q.category === 'Vocabulary') {
        categoryBreakdown.Vocabulary.total++;
        if (isCorrect) categoryBreakdown.Vocabulary.correct++;
      } else if (q.category === 'Grammar') {
        categoryBreakdown.Grammar.total++;
        if (isCorrect) categoryBreakdown.Grammar.correct++;
      }

      // Context Practice: paragraph-context type questions
      if (q.type === 'paragraph-context') {
        categoryBreakdown.Context.total++;
        if (isCorrect) categoryBreakdown.Context.correct++;
      }
    });

    // Calculate percentages
    Object.keys(topicBreakdown).forEach(tKey => {
      const item = topicBreakdown[tKey];
      item.percentage = Math.round((item.correct / item.total) * 100);
    });
    Object.keys(categoryBreakdown).forEach(cKey => {
      const item = categoryBreakdown[cKey];
      item.percentage = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    });

    const totalQ = questions.length;
    const percentage = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
    const timeSpent = (activeMock.timeLimitMinutes * 60) - secondsRemaining;

    const attempt: MockExamAttempt = {
      id: `attempt-${Date.now()}`,
      mockId: selectedMockId,
      date: new Date().toLocaleDateString('th-TH'),
      timestamp: Date.now(),
      score: correctCount,
      totalQuestions: totalQ,
      percentage,
      timeSpentSeconds: timeSpent,
      topicBreakdown,
      categoryBreakdown,
      userAnswers
    };

    setLastAttemptResult(attempt);
    const newStats = recordMockSubmission(stats, attempt);
    onUpdateStats(newStats);

    if (percentage >= 75) {
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="page-wrapper">
      {!isExamRunning && !examSubmitted ? (
        /* MOCK EXAM SELECTION LOBBY */
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 className="page-title">
              <FileCheck2 size={28} color="var(--primary-600)" />
              Full Mock Exam Simulation (6 Standard Sets)
            </h1>
            <p className="page-subtitle">
              จำลองสอบเสมือนจริง 6 ชุดมาตรฐาน ครอบคลุม Unit 3 & 4 ตรงตามโครงสร้าง Final Exam Review
            </p>
          </div>

          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            {MOCK_EXAMS.map(mock => {
              const prevAttempts = stats.mockAttempts?.filter(a => a.mockId === mock.id) || [];
              const latestAttempt = prevAttempts[prevAttempts.length - 1];
              const qCount = mock.questionIds.length;

              return (
                <div key={mock.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span className="badge badge-info">MOCK {mock.id}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> {mock.timeLimitMinutes} นาที • {qCount} ข้อ
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.45rem', color: 'var(--text-primary)' }}>
                      {mock.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      {mock.description}
                    </p>
                  </div>

                  <div>
                    {latestAttempt ? (
                      <div style={{
                        padding: '0.6rem 0.85rem',
                        backgroundColor: 'var(--bg-input)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        marginBottom: '0.85rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span>ทำล่าสุด: <strong>{latestAttempt.percentage}%</strong> ({latestAttempt.score}/{latestAttempt.totalQuestions})</span>
                        <span style={{ color: latestAttempt.percentage >= 70 ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                          {latestAttempt.percentage >= 70 ? 'ผ่านเกณฑ์' : 'ควรทบทวน'}
                        </span>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                        ยังไม่เคยทำชุดนี้
                      </div>
                    )}

                    <button
                      id={`btn-start-mock-${mock.id}`}
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      onClick={() => handleStartExam(mock.id)}
                    >
                      {latestAttempt ? 'ทำข้อสอบชุดนี้อีกครั้ง' : 'เริ่มทำข้อสอบชุดนี้'}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : isExamRunning && !examSubmitted ? (
        /* ACTIVE EXAM RUNNING MODE */
        <div>
          {/* Top Sticky Status Bar */}
          <div style={{
            position: 'sticky',
            top: '60px',
            zIndex: 30,
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{activeMock.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ข้อที่ {currentQIndex + 1} จาก {questions.length} • ตอบแล้ว {Object.keys(userAnswers).length}/{questions.length} ข้อ
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 700,
                color: secondsRemaining < 300 ? 'var(--danger)' : 'var(--primary-600)',
                fontSize: '1.1rem',
                fontFamily: 'var(--font-mono)'
              }}>
                <Clock size={18} />
                {formatTimer(secondsRemaining)}
              </div>

              <button
                id="mock-btn-submit-exam"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  if (window.confirm('คุณต้องการส่งข้อสอบและตรวจคำตอบทันทีหรือไม่?')) {
                    handleSubmitExam();
                  }
                }}
              >
                ส่งข้อสอบ (Submit)
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 240px', gap: '1.25rem' }}>
            {/* Question Workspace */}
            {currentQuestion && (
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <span className="badge badge-info">{currentQuestion.category}</span>
                    <span className="badge badge-neutral">{currentQuestion.unit.toUpperCase()}</span>
                  </div>
                  <button
                    className={`btn btn-sm ${flaggedQuestions[currentQuestion.id] ? 'btn-danger' : 'btn-outline'}`}
                    onClick={() => toggleFlag(currentQuestion.id)}
                  >
                    <Flag size={14} />
                    {flaggedQuestions[currentQuestion.id] ? 'Flagged' : 'Flag for review'}
                  </button>
                </div>

                {currentQuestion.paragraphText && (
                  <div style={{
                    backgroundColor: 'var(--bg-input)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    marginBottom: '1rem',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)'
                  }}>
                    {currentQuestion.paragraphText}
                  </div>
                )}

                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {currentQuestion.question}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {currentQuestion.options.map((opt, i) => {
                    const isSelected = userAnswers[currentQuestion.id] === opt;
                    return (
                      <button
                        key={i}
                        className={`option-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectOption(currentQuestion.id, opt)}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check size={18} color="var(--primary-600)" />}
                      </button>
                    );
                  })}
                </div>

                {/* Exam Prev / Next Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                  <button
                    className="btn btn-secondary"
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex(prev => prev - 1)}
                  >
                    <ArrowLeft size={16} />
                    ข้อก่อนหน้า
                  </button>

                  <button
                    className="btn btn-primary"
                    disabled={currentQIndex >= questions.length - 1}
                    onClick={() => setCurrentQIndex(prev => prev + 1)}
                  >
                    ข้อถัดไป
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Question Quick Palette */}
            <div className="card" style={{ height: 'fit-content' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                Question Palette
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.35rem' }}>
                {questions.map((q, idx) => {
                  const isAnswered = !!userAnswers[q.id];
                  const isFlagged = !!flaggedQuestions[q.id];
                  const isCurrent = idx === currentQIndex;

                  let bg = 'var(--bg-input)';
                  let color = 'var(--text-primary)';
                  let border = '1px solid var(--border-light)';

                  if (isCurrent) {
                    border = '2px solid var(--primary-600)';
                  }
                  if (isAnswered) {
                    bg = 'var(--primary-50)';
                    color = 'var(--primary-700)';
                  }
                  if (isFlagged) {
                    bg = 'var(--danger-bg)';
                    color = 'var(--danger-text)';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQIndex(idx)}
                      style={{
                        padding: '0.4rem 0',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: bg,
                        color,
                        border,
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* EXAM RESULTS & DEEP BREAKDOWN */
        lastAttemptResult && (
          <div>
            {/* Score Card */}
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--bg-card), var(--bg-surface-elevated))' }}>
              <Award size={48} color={lastAttemptResult.percentage >= 70 ? 'var(--success)' : 'var(--warning)'} style={{ margin: '0 auto 0.75rem auto' }} />
              <h2 style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>
                Mock Exam Results • ผลการสอบ
              </h2>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: lastAttemptResult.percentage >= 70 ? 'var(--success)' : 'var(--danger)' }}>
                {lastAttemptResult.percentage}%
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                ตอบถูก <strong>{lastAttemptResult.score}</strong> จากทั้งหมด <strong>{lastAttemptResult.totalQuestions}</strong> ข้อ (ใช้เวลา {Math.floor(lastAttemptResult.timeSpentSeconds / 60)} นาที {lastAttemptResult.timeSpentSeconds % 60} วินาที)
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button 
                  id="mock-btn-retry"
                  className="btn btn-primary"
                  onClick={() => handleStartExam(selectedMockId)}
                >
                  <RotateCcw size={16} />
                  ทำชุดนี้ซ้ำอีกครั้ง (Retry)
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => { setExamSubmitted(false); setIsExamRunning(false); }}
                >
                  เลือก Mock Exam ชุดอื่น
                </button>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
              {Object.entries(lastAttemptResult.categoryBreakdown).map(([cat, val]) => {
                const label = cat === 'Vocabulary' ? 'VOCABULARY ACCURACY' : cat === 'Grammar' ? 'GRAMMAR ACCURACY' : 'CONTEXT PRACTICE';
                const hasQuestions = val.total > 0;

                return (
                  <div key={cat} className="card">
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>{label}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: !hasQuestions ? 'var(--text-muted)' : val.percentage >= 70 ? 'var(--success)' : 'var(--danger)', marginTop: '0.25rem' }}>
                      {hasQuestions ? `${val.percentage}%` : '—'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {hasQuestions ? `ตอบถูก ${val.correct} / ${val.total} ข้อ` : 'ไม่มีข้อประเภทนี้ในชุด'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Topic Weakness Analysis for this Mock */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>
                Topic Breakdown & Recommendations (วิเคราะห์รายหัวข้อ)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(lastAttemptResult.topicBreakdown).map(([tId, tVal]) => (
                  <div key={tId} style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{tId}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        คะแนน {tVal.correct}/{tVal.total} ({tVal.percentage}%)
                      </div>
                    </div>

                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => onNavigateToStudy(tId)}
                    >
                      ทบทวนหัวข้อนี้
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Review All Answers with Explanations */}
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>
                Review Answers & Explanations (เฉลยละเอียดทุกข้อ)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {questions.map((q, idx) => {
                  const userAns = userAnswers[q.id];
                  const isCorrect = userAns?.trim().toLowerCase() === q.answer.trim().toLowerCase();

                  return (
                    <div 
                      key={q.id}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${isCorrect ? 'var(--success-border)' : 'var(--danger-border)'}`,
                        backgroundColor: isCorrect ? 'var(--bg-card)' : 'var(--danger-bg)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>ข้อที่ {idx + 1} • {q.subtopic}</span>
                        <span className={`badge ${isCorrect ? 'badge-success' : 'badge-danger'}`}>
                          {isCorrect ? 'ถูกต้อง' : 'ตอบผิด'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        {q.question}
                      </div>

                      <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <div>คำตอบของคุณ: <strong style={{ color: isCorrect ? 'var(--success-text)' : 'var(--danger-text)' }}>{userAns || '(ไม่ได้ตอบ)'}</strong></div>
                        {!isCorrect && <div>คำตอบที่ถูกต้อง: <strong style={{ color: 'var(--success-text)' }}>{q.answer}</strong></div>}
                      </div>

                      <div style={{
                        padding: '0.6rem 0.85rem',
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        border: '1px solid var(--border-light)'
                      }}>
                        <strong>💡 เหตุผล:</strong> {q.explanationTh}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
