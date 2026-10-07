import React, { useState } from 'react';
import { GRAMMAR_LESSONS } from '../data/grammar';
import { VOCABULARY_LIST } from '../data/vocabulary';
import { 
  Search, 
  BookOpen, 
  FileText, 
  Zap, 
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const QuickReviewView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<'all' | 'unit3' | 'unit4'>('all');

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">
          <Zap size={28} color="var(--warning)" />
          Final Exam Quick Review & Cheat Sheet
        </h1>
        <p className="page-subtitle">
          สรุปสูตรลัด กฎเหล็ก และข้อควรระวังสำคัญสำหรับอ่านทบทวนก่อนเข้าห้องสอบ English III
        </p>
      </div>

      {/* Filter and Search */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: '1 1 250px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="ค้นหา cheat sheet, กฎไวยากรณ์ หรือคำศัพท์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem 0.6rem 2.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button 
            className={`btn btn-sm ${selectedUnit === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedUnit('all')}
          >
            All Units
          </button>
          <button 
            className={`btn btn-sm ${selectedUnit === 'unit3' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedUnit('unit3')}
          >
            Unit 3
          </button>
          <button 
            className={`btn btn-sm ${selectedUnit === 'unit4' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedUnit('unit4')}
          >
            Unit 4
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* ================= UNIT 3 CHEAT SHEET ================= */}
        {(selectedUnit === 'all' || selectedUnit === 'unit3') && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-info" style={{ fontSize: '0.85rem' }}>UNIT 3</span>
              <h2 style={{ fontSize: '1.25rem' }}>Ability, Multi-word Verbs & Tenses</h2>
            </div>

            <div className="grid-2" style={{ marginBottom: '1rem' }}>
              {/* Present Perfect vs Cont */}
              <div className="card">
                <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-600)', marginBottom: '0.45rem' }}>
                  ⚡ Present Perfect vs Present Perfect Continuous
                </h3>
                <div style={{ fontSize: '0.85rem', marginBottom: '0.65rem' }}>
                  <div><strong>Present Perfect (have/has + V3):</strong> เน้นผลลัพธ์ (Result), ความสำเร็จ, จำนวนครั้ง เช่น <em>5 times, 3 books, already, yet</em></div>
                  <div style={{ marginTop: '4px' }}><strong>Present Perfect Continuous (have/has + been + V-ing):</strong> เน้นความต่อเนื่อง (Duration), กิจกรรมที่ทำมาเรื่อยๆ เช่น <em>for hours, since Monday, all day</em></div>
                </div>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--warning-bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--warning-text)' }}>
                  ⚠️ <strong>Stative Verbs ห้ามเติม -ing:</strong> know, love, understand, believe ต้องใช้ <em>I've known her for years</em> (ห้าม I've been knowing)
                </div>
              </div>

              {/* Multi-word Verbs 4 Types */}
              <div className="card">
                <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-600)', marginBottom: '0.45rem' }}>
                  ⚡ Multi-word Verbs 4 ประเภท
                </h3>
                <div style={{ fontSize: '0.825rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>Type 1 (Intransitive ไม่มีกรรม):</strong> wake up, go away, fall down, stay up, break up, sit down, take off, calm down</div>
                  <div><strong>Type 2 (Transitive กรรมคั่นกลางได้):</strong> wake sb up, take sth off, calm sb down, try sth out, figure sth out, make sth up, throw sth away, pick sth up, let sb down</div>
                  <div><strong>Type 3 (Transitive กรรมอยู่หลัง Prep):</strong> look into, focus on, believe in, live for, be into, look after</div>
                  <div><strong>Type 4 (Three-word verb):</strong> come up with, look down on, look up to, run out of, fall out with, go on about, get away with</div>
                </div>
                <div style={{ marginTop: '6px', padding: '0.5rem', backgroundColor: 'var(--danger-bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--danger-text)' }}>
                  ⚠️ <strong>Pronoun Rule:</strong> Type 2 ถ้ากรรมเป็น me/him/her/it/them ต้องวางตรงกลางเสมอ เช่น <em>wake him up</em> (ห้าม wake up him)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= UNIT 4 CHEAT SHEET ================= */}
        {(selectedUnit === 'all' || selectedUnit === 'unit4') && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-info" style={{ fontSize: '0.85rem' }}>UNIT 4</span>
              <h2 style={{ fontSize: '1.25rem' }}>Cause & Result, Difficulty, Habits & Obligation</h2>
            </div>

            <div className="grid-2">
              {/* Habits & Accustomed */}
              <div className="card">
                <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-600)', marginBottom: '0.45rem' }}>
                  ⚡ used to vs would vs be/get used to
                </h3>
                <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>used to + V1:</strong> เคยทำ/เคยเป็นในอดีต (ปัจจุบันไม่แล้ว) ปฏิเสธ: <em>didn't use to</em> (use ไม่มี d)</div>
                  <div><strong>would + action verb:</strong> ทำซ้ำๆ ในอดีต (ห้ามใช้กับ stative verbs เช่น live, be)</div>
                  <div><strong>be used to + V-ing / Noun:</strong> คุ้นชินกับ (ตามด้วย Gerund เสมอ เช่น <em>was used to doing</em>)</div>
                  <div><strong>get used to + V-ing:</strong> เริ่มปรับตัวให้คุ้นชิน (เช่น <em>haven't got used to running</em>)</div>
                </div>
              </div>

              {/* Obligation & Permission */}
              <div className="card">
                <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-600)', marginBottom: '0.45rem' }}>
                  ⚡ Obligation & Permission
                </h3>
                <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>be supposed to + V1:</strong> ควรจะ/มีกำหนดการต้องทำ (ต้องมี verb to be เสมอ)</div>
                  <div><strong>be forced to + V1:</strong> ถูกบังคับให้ทำ</div>
                  <div><strong>let someone + bare V:</strong> อนุญาต/ปล่อยให้ทำ (ห้ามมี to เช่น <em>let me relax</em>)</div>
                  <div><strong>didn't need to:</strong> ไม่จำเป็นต้องทำในอดีต</div>
                  <div><strong>wasn't allowed to:</strong> ไม่ได้รับอนุญาต/ถูกห้าม</div>
                </div>
              </div>
            </div>

            {/* Cause & Result Collocations */}
            <div className="card" style={{ marginTop: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-600)', marginBottom: '0.45rem' }}>
                ⚡ Cause & Result & Difficulty Collocations
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                  <strong>results in:</strong> ส่งผลให้เกิด (+ Noun/Outcome)<br />
                  <strong>led to:</strong> นำไปสู่ (รูปอดีตของ lead to)
                </div>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                  <strong>had an effect on:</strong> มีผลกระทบต่อ (effect = คำนาม)<br />
                  <strong>affect + Direct Object:</strong> ส่งผลกระทบ (affect = กริยา)
                </div>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                  <strong>rigorous:</strong> training/testing (เข้มงวด/มาตรฐานสูง)<br />
                  <strong>arduous:</strong> climb/journey (ตรากตรำ/เหน็ดเหนื่อย)
                </div>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                  <strong>tricky / tough:</strong> decision (ยุ่งยาก/ลำบากใจ)<br />
                  <strong>backbreaking:</strong> manual work (งานหนักเจียนตาย)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
