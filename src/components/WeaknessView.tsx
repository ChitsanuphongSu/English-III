import React from 'react';
import { UserStats } from '../types';
import { analyzeTopicPerformance } from '../utils/analytics';
import { TOPICS } from '../data/vocabulary';
import { 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight, 
  TrendingUp,
  BarChart3,
  Award
} from 'lucide-react';

interface WeaknessViewProps {
  stats: UserStats;
  onNavigateToStudy: (topicId: string) => void;
  onNavigateToMock: () => void;
}

export const WeaknessView: React.FC<WeaknessViewProps> = ({
  stats,
  onNavigateToStudy,
  onNavigateToMock
}) => {
  const topicAnalysis = analyzeTopicPerformance(stats);
  const topicsList = Object.values(topicAnalysis);

  const weakTopics = topicsList.filter(t => t.totalAttempts >= 3 && t.accuracy < 70);
  const strongTopics = topicsList.filter(t => t.totalAttempts >= 3 && t.accuracy >= 70);
  const untestedTopics = topicsList.filter(t => t.totalAttempts < 3);

  const getStatusBadge = (status: string, acc: number, attempts: number) => {
    if (attempts < 3) return <span className="badge badge-neutral">ข้อมูลยังไม่พอ ({attempts}/3)</span>;
    if (acc >= 80) return <span className="badge badge-success">🟢 Strong ({acc}%)</span>;
    if (acc >= 65) return <span className="badge badge-warning">🟡 Needs Practice ({acc}%)</span>;
    if (acc >= 50) return <span className="badge badge-danger">🟠 Weak ({acc}%)</span>;
    return <span className="badge badge-danger">🔴 Very Weak ({acc}%)</span>;
  };

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">
          <Flame size={28} color="var(--danger)" />
          Weakness Detection & Skill Diagnostics
        </h1>
        <p className="page-subtitle">
          ระบบวิเคราะห์ความแม่นยำรายหัวข้อ พร้อมเกณฑ์ขั้นต่ำ (Minimum Attempts) เพื่อความแม่นยำในการวินิจฉัย
        </p>
      </div>

      {/* Logic Notice */}
      <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--bg-surface-elevated)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem', fontWeight: 700, fontSize: '0.9rem' }}>
          <AlertCircle size={16} color="var(--primary-600)" />
          เกณฑ์การคำนวณและประเมินผล (Diagnostics Confidence)
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          ระบบจะไม่ด่วนสรุปว่าคุณอ่อนหรือเก่งในหัวข้อใดจากการทำเพียง 1-2 ข้อ (ต้องทำอย่างน้อย 3-5 ข้อขึ้นไปเพื่อประเมินความแม่นยำที่แท้จริง)
        </p>
      </div>

      {/* Diagnostics Grid */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Priority Weak Topics */}
        <div className="card" style={{ borderTop: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Flame size={20} color="var(--danger)" />
            <h3 style={{ fontSize: '1.1rem' }}>Priority Weak Areas ({weakTopics.length})</h3>
          </div>

          {weakTopics.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              ไม่มีหัวข้อที่ตกเกณฑ์ความแม่นยำต่ำกว่า 70% (ยอดเยี่ยมมาก!)
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {weakTopics.map(item => (
                <div key={item.topicId} style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--danger-bg)',
                  border: '1px solid var(--danger-border)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--danger-text)' }}>{item.nameTh}</span>
                    <span className="badge badge-danger">{item.accuracy}%</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {item.recommendationTh}
                  </p>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => onNavigateToStudy(item.topicId)}
                  >
                    เริ่มทบทวนหัวข้อนี้
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mastered Strong Topics */}
        <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Award size={20} color="var(--success)" />
            <h3 style={{ fontSize: '1.1rem' }}>Mastered Areas ({strongTopics.length})</h3>
          </div>

          {strongTopics.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              ยังไม่มีหัวข้อที่ผ่านเกณฑ์ความแม่นยำ 70%+ (ทำแบบฝึกหัดหรือ Mock Exam เพิ่มเติม)
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {strongTopics.map(item => (
                <div key={item.topicId} style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--success-bg)',
                  border: '1px solid var(--success-border)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--success-text)' }}>{item.nameTh}</span>
                    <span className="badge badge-success">{item.accuracy}%</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    ทำถูก {item.correctAttempts} จาก {item.totalAttempts} ข้อ • {item.recommendationTh}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Syllabus Audit */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>
          All Syllabus Topics Diagnostic Status
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {topicsList.map(item => (
            <div 
              key={item.topicId}
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{item.category}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {item.nameTh} • ทำไปแล้ว {item.totalAttempts} ครั้ง (ถูก {item.correctAttempts} ครั้ง)
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {item.totalAttempts >= 3 && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                    <div>ล่าสุด: <strong>{item.recentAccuracy}%</strong> {item.trend === 'improving' ? '↑ เพิ่มขึ้น' : item.trend === 'declining' ? '↓ ลดลง' : '→ คงที่'}</div>
                  </div>
                )}
                {getStatusBadge(item.statusLevel, item.accuracy, item.totalAttempts)}
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => onNavigateToStudy(item.topicId)}
                >
                  ทบทวน
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
