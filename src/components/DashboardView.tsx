import React from 'react';
import { UserStats, TopicId } from '../types';
import { getDashboardSummary, analyzeTopicPerformance } from '../utils/analytics';
import { TOPICS } from '../data/vocabulary';
import { MOCK_EXAMS } from '../data/mockExams';
import { 
  Target, 
  Award, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Play, 
  TrendingUp,
  RotateCcw,
  Sparkles,
  HelpCircle,
  BarChart3
} from 'lucide-react';

interface DashboardViewProps {
  stats: UserStats;
  onNavigate: (tab: string, contextId?: string | number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ stats, onNavigate }) => {
  const summary = getDashboardSummary(stats);
  const topicAnalysis = analyzeTopicPerformance(stats);

  const getAccuracyColor = (acc: number) => {
    if (acc >= 80) return 'var(--success)';
    if (acc >= 65) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="page-wrapper">
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h1 className="page-title">
            <Target size={28} color="var(--primary-600)" />
            Exam Training Dashboard
          </h1>
          <p className="page-subtitle">
            เตรียมพร้อมสอบ Final วิชา English III (Unit 3 & 4) ตามเกณฑ์ข้อสอบจริง
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            id="dash-btn-start-mock"
            className="btn btn-primary"
            onClick={() => onNavigate('mock', 1)}
          >
            <Play size={16} />
            ทำ Mock Exam
          </button>
          <button 
            id="dash-btn-vocab-practice"
            className="btn btn-secondary"
            onClick={() => onNavigate('vocab')}
          >
            <BookOpen size={16} />
            ฝึก Vocabulary
          </button>
        </div>
      </div>

      {/* Recommended Next Action Banner (Feature: "What should I study now?") */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, var(--primary-50), var(--bg-card))',
        borderColor: 'var(--primary-200)',
        marginBottom: '1.5rem',
        padding: '1.25rem 1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ maxWidth: '700px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              <Sparkles size={18} color="var(--primary-600)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary-600)', letterSpacing: '0.05em' }}>
                Recommended Next Step • ลำดับแนะนำต่อไป
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>
              {summary.nextRecommendedAction.titleTh}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {summary.nextRecommendedAction.descriptionTh}
            </p>
          </div>

          <button 
            id="dash-btn-start-recommended"
            className="btn btn-primary"
            style={{ fontWeight: 700 }}
            onClick={() => {
              if (summary.nextRecommendedAction.actionType === 'study') {
                onNavigate('grammar', summary.nextRecommendedAction.targetId);
              } else if (summary.nextRecommendedAction.actionType === 'mock') {
                onNavigate('mock', summary.nextRecommendedAction.targetId);
              } else if (summary.nextRecommendedAction.actionType === 'review-mistakes') {
                onNavigate('mistakes');
              } else {
                onNavigate('vocab');
              }
            }}
          >
            เริ่มตอนนี้เลย
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Exam Status Metrics */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            OVERALL ACCURACY
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: summary.hasEnoughData ? getAccuracyColor(summary.overallAccuracy) : 'var(--text-muted)' }}>
            {summary.hasEnoughData ? `${summary.overallAccuracy}%` : '—'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            {summary.totalQuestionsAnswered > 0 ? `จากข้อที่ทำไปทั้งหมด ${summary.totalQuestionsAnswered} ครั้ง` : 'ยังไม่มีประวัติการทำโจทย์'}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            VOCABULARY STATUS
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-600)' }}>
            {summary.knownVocabCount} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>/ {summary.totalVocabCount}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            {summary.vocabAccuracy > 0 ? `ความแม่นยำโจทย์คำศัพท์ ${summary.vocabAccuracy}%` : 'คำศัพท์ที่ทำเครื่องหมายว่าจำได้'}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            GRAMMAR ACCURACY
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: summary.grammarAccuracy > 0 ? getAccuracyColor(summary.grammarAccuracy) : 'var(--text-muted)' }}>
            {summary.grammarAccuracy > 0 ? `${summary.grammarAccuracy}%` : '—'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            {summary.grammarAccuracy > 0 ? 'รวมโจทย์ Multi-word & Tense' : 'ยังไม่ได้ทำโจทย์ไวยากรณ์'}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            MOCK EXAM AVERAGE
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: summary.totalMocksCompleted > 0 ? getAccuracyColor(summary.mockAverageScore) : 'var(--text-muted)' }}>
            {summary.totalMocksCompleted > 0 ? `${summary.mockAverageScore}%` : '—'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            {summary.totalMocksCompleted > 0 ? `ทำไปแล้ว ${summary.totalMocksCompleted} ชุด (สูงสุด ${summary.mockBestScore}%)` : 'ยังไม่ได้ทำ Mock Exam'}
          </div>
        </div>
      </div>

      {/* Weakest vs Strongest Analysis Box */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Weak Topic Card */}
        <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <Flame size={20} color="var(--danger)" />
            <h3 style={{ fontSize: '1rem' }}>Weakest Area • จุดที่ยังผิดบ่อย</h3>
          </div>
          {summary.weakestTopic ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{summary.weakestTopic.nameTh}</div>
                <span className="badge badge-danger">{summary.weakestTopic.accuracy}% Accuracy</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                {summary.weakestTopic.recommendationTh}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => onNavigate(summary.weakestTopic?.category === 'Vocabulary' ? 'vocab' : 'grammar', summary.weakestTopic?.topicId)}
                >
                  ทบทวนเนื้อหา
                </button>
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => onNavigate('mock', 1)}
                >
                  ฝึกทำโจทย์ซ้ำ
                </button>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              ยังไม่มีข้อมูลเพียงพอในการประเมินจุดอ่อน (ต้องทำอย่างน้อย 3-5 ข้อในหัวข้อนั้นๆ)
            </div>
          )}
        </div>

        {/* Strong Topic Card */}
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <CheckCircle2 size={20} color="var(--success)" />
            <h3 style={{ fontSize: '1rem' }}>Strongest Area • จุดที่แม่นยำสูง</h3>
          </div>
          {summary.strongestTopic ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{summary.strongestTopic.nameTh}</div>
                <span className="badge badge-success">{summary.strongestTopic.accuracy}% Accuracy</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                {summary.strongestTopic.recommendationTh}
              </p>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => onNavigate('weakness')}
              >
                ดูสรุปทุกหัวข้อ
              </button>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              ทำแบบฝึกหัดหรือ Mock Exam เพิ่มเติมเพื่อปลดล็อคสถิติจุดแข็งของคุณ
            </div>
          )}
        </div>
      </div>

      {/* Mock Exam Performance Trend Section */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <BarChart3 size={18} color="var(--primary-600)" />
              Mock Exam Performance Trend • ผลการสอบจำลอง 6 ชุด
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ติดตามพัฒนาการคะแนนสอบจำลอง (Best: {summary.mockBestScore}% • Latest: {summary.mockLatestScore}% • Avg: {summary.mockAverageScore}%)
            </p>
          </div>
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => onNavigate('mock', 1)}
          >
            ทำ Mock Exam
          </button>
        </div>

        <div className="grid-3" style={{ gap: '0.75rem' }}>
          {MOCK_EXAMS.map(mock => {
            const attempts = stats.mockAttempts?.filter(a => a.mockId === mock.id) || [];
            const latest = attempts[attempts.length - 1];
            const best = attempts.reduce((max, a) => Math.max(max, a.percentage), 0);
            const hasAttempt = attempts.length > 0;

            return (
              <div 
                key={mock.id}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>Mock {mock.id}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: hasAttempt ? getAccuracyColor(latest.percentage) : 'var(--text-muted)' }}>
                    {hasAttempt ? `${latest.percentage}%` : 'ยังไม่ได้ทำ'}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                  {mock.title.replace(/^Mock Exam \d+:\s*/, '')}
                </div>

                <div className="progress-container" style={{ height: '6px', marginBottom: '0.5rem' }}>
                  <div 
                    className={`progress-fill ${hasAttempt && latest.percentage >= 70 ? 'progress-fill-success' : 'progress-fill-warning'}`}
                    style={{ width: hasAttempt ? `${latest.percentage}%` : '0%' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>ทำไป {attempts.length} ครั้ง (สูงสุด {best}%)</span>
                  <button 
                    style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontWeight: 700, cursor: 'pointer', padding: '2px 4px' }}
                    onClick={() => onNavigate('mock', mock.id)}
                  >
                    {hasAttempt ? 'ทำซ้ำ' : 'เริ่มสอบ'} →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic Accuracy Breakdown Table */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem' }}>Exam Syllabus Progress (Unit 3 & 4)</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>สถิติความพร้อมแยกตามหัวข้อข้อสอบจริง</p>
          </div>
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => onNavigate('weakness')}
          >
            ดูการวิเคราะห์เชิงลึก
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {TOPICS.map(topic => {
            const data = topicAnalysis[topic.id];
            const hasAttempts = data.totalAttempts >= 3;

            return (
              <div 
                key={topic.id}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div style={{ minWidth: '240px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${topic.unit === 'unit3' ? 'badge-info' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                      {topic.unit.toUpperCase()}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{topic.name}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {topic.nameTh}
                  </div>
                </div>

                <div style={{ width: '220px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span>รวม: <strong style={{ color: hasAttempts ? getAccuracyColor(data.accuracy) : 'var(--text-muted)' }}>{hasAttempts ? `${data.accuracy}%` : 'ยังไม่พอ'}</strong></span>
                    {hasAttempts && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        ล่าสุด: <strong style={{ color: getAccuracyColor(data.recentAccuracy) }}>{data.recentAccuracy}%</strong> {data.trend === 'improving' ? '↑' : data.trend === 'declining' ? '↓' : '→'}
                      </span>
                    )}
                  </div>
                  <div className="progress-container" style={{ height: '6px' }}>
                    <div 
                      className={`progress-fill ${data.accuracy >= 80 ? 'progress-fill-success' : data.accuracy >= 65 ? 'progress-fill-warning' : 'progress-fill-danger'}`}
                      style={{ width: hasAttempts ? `${data.accuracy}%` : '0%' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => onNavigate(topic.category === 'Vocabulary' ? 'vocab' : 'grammar', topic.id)}
                  >
                    อ่านสรุป
                  </button>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => onNavigate('mock', 1)}
                  >
                    ฝึกโจทย์
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 9-Step Learning Loop Visual */}
      <div className="card" style={{ background: 'var(--bg-surface-elevated)' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <TrendingUp size={18} color="var(--primary-600)" />
          Continuous Study Loop • วงจรการเรียนเพื่อคะแนนสูงสุด
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          fontSize: '0.75rem',
          fontWeight: 700
        }}>
          <span className="badge badge-neutral">1. Study Rules</span>
          <ArrowRight size={12} color="var(--text-muted)" />
          <span className="badge badge-neutral">2. Flashcards</span>
          <ArrowRight size={12} color="var(--text-muted)" />
          <span className="badge badge-neutral">3. Context Practice</span>
          <ArrowRight size={12} color="var(--text-muted)" />
          <span className="badge badge-info">4. Mock Exam</span>
          <ArrowRight size={12} color="var(--text-muted)" />
          <span className="badge badge-warning">5. Weakness Analysis</span>
          <ArrowRight size={12} color="var(--text-muted)" />
          <span className="badge badge-danger">6. Review Mistakes</span>
          <ArrowRight size={12} color="var(--text-muted)" />
          <span className="badge badge-success">7. Mock Exam 2-6</span>
        </div>
      </div>
    </div>
  );
};
