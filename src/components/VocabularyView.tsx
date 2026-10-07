import React, { useState } from 'react';
import { VOCABULARY_LIST, TOPICS } from '../data/vocabulary';
import { VocabItem, UserStats, TopicId } from '../types';
import { saveUserStats } from '../utils/analytics';
import { 
  Languages, 
  RotateCw, 
  Check, 
  X, 
  Search, 
  Filter, 
  Volume2, 
  Sparkles,
  HelpCircle,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface VocabularyViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  initialTopicId?: string;
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({
  stats,
  onUpdateStats,
  initialTopicId
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopicId || 'all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeMode, setActiveMode] = useState<'flashcard' | 'meaning-to-word' | 'word-to-meaning' | 'context' | 'table'>('flashcard');

  // Flashcard State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Quiz Mode State
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);

  // Filter Vocabulary
  const filteredVocab = VOCABULARY_LIST.filter(item => {
    const matchesTopic = selectedTopic === 'all' || item.topic === selectedTopic;
    const matchesSearch = 
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaningEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaningTh.includes(searchTerm) ||
      (item.exampleSentence && item.exampleSentence.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTopic && matchesSearch;
  });

  const currentItem: VocabItem | undefined = filteredVocab[currentIndex];

  const handleMarkStatus = (vocabId: string, status: 'known' | 'review') => {
    const updatedStatus = {
      ...stats.vocabularyStatus,
      [vocabId]: status
    };
    const newStats = {
      ...stats,
      vocabularyStatus: updatedStatus
    };
    onUpdateStats(newStats);
    saveUserStats(newStats);

    // Next Card
    setIsFlipped(false);
    if (currentIndex < filteredVocab.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    if (currentIndex < filteredVocab.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredVocab.length - 1);
    }
  };

  // Generate 4 Quiz Options for Mode B & C
  const getQuizOptions = (item: VocabItem, mode: 'meaning-to-word' | 'word-to-meaning') => {
    const otherItems = VOCABULARY_LIST.filter(v => v.id !== item.id);
    const shuffledOthers = [...otherItems].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    if (mode === 'meaning-to-word') {
      const options = [item.word, ...shuffledOthers.map(o => o.word)];
      return options.sort(() => 0.5 - Math.random());
    } else {
      const options = [item.meaningTh, ...shuffledOthers.map(o => o.meaningTh)];
      return options.sort(() => 0.5 - Math.random());
    }
  };

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">
          <Languages size={28} color="var(--primary-600)" />
          Vocabulary Mastery System
        </h1>
        <p className="page-subtitle">
          คำศัพท์และสำนวนทั้งหมดจากข้อสอบจริง Final Exam Review (Unit 3A, 4A, 4B)
        </p>
      </div>

      {/* Mode Selection Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        marginBottom: '1.25rem',
        borderBottom: '1px solid var(--border-light)',
        paddingBottom: '0.75rem'
      }}>
        <button
          id="vocab-mode-flashcard"
          className={`btn btn-sm ${activeMode === 'flashcard' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => { setActiveMode('flashcard'); setIsFlipped(false); }}
        >
          <RotateCw size={14} />
          Flashcard Memorization
        </button>

        <button
          id="vocab-mode-meaning-to-word"
          className={`btn btn-sm ${activeMode === 'meaning-to-word' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => { setActiveMode('meaning-to-word'); setSelectedAnswer(null); setIsAnswerChecked(false); }}
        >
          Meaning → Word Quiz
        </button>

        <button
          id="vocab-mode-word-to-meaning"
          className={`btn btn-sm ${activeMode === 'word-to-meaning' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => { setActiveMode('word-to-meaning'); setSelectedAnswer(null); setIsAnswerChecked(false); }}
        >
          Word → Meaning Quiz
        </button>

        <button
          id="vocab-mode-table"
          className={`btn btn-sm ${activeMode === 'table' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveMode('table')}
        >
          <BookOpen size={14} />
          Full Vocabulary Bank ({VOCABULARY_LIST.length} Words)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap',
        marginBottom: '1.5rem',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'relative',
          flex: '1 1 250px'
        }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="vocab-search-input"
            type="text"
            placeholder="ค้นหาคำศัพท์ ความหมาย หรือตัวอย่างประโยค..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentIndex(0); }}
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

        <select
          id="vocab-topic-filter"
          value={selectedTopic}
          onChange={(e) => { setSelectedTopic(e.target.value); setCurrentIndex(0); }}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-strong)',
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <option value="all">ทุกหัวข้อ (All Topics - {VOCABULARY_LIST.length} คำ)</option>
          <option value="vocab-ability">Unit 3A: Ability & Achievement</option>
          <option value="vocab-cause-result">Unit 4A: Cause and Result</option>
          <option value="vocab-difficulty">Unit 4B: Talking about Difficulty</option>
          <option value="grammar-multiword">Unit 3A: Multi-word Verbs</option>
        </select>
      </div>

      {filteredVocab.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <HelpCircle size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3>ไม่พบคำศัพท์ที่ตรงกับการค้นหา</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>ลองพิมพ์คำค้นหาอื่นหรือเปลี่ยนหัวข้อตัวกรอง</p>
        </div>
      ) : activeMode === 'flashcard' && currentItem ? (
        /* FLASHCARD MODE */
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Card {currentIndex + 1} of {filteredVocab.length}</span>
            <span className="badge badge-neutral">{currentItem.pos}</span>
          </div>

          <div 
            id="flashcard-main"
            onClick={() => setIsFlipped(!isFlipped)}
            className="card"
            style={{
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '2.5rem 1.5rem',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.25s ease',
              border: isFlipped ? '2px solid var(--primary-500)' : '1px solid var(--border-light)',
              backgroundColor: isFlipped ? 'var(--bg-surface-elevated)' : 'var(--bg-card)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative'
            }}
          >
            <div style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              คลิกเพื่อ {isFlipped ? 'ดูคำศัพท์' : 'ดูคำแปล/ตัวอย่าง'}
            </div>

            {!isFlipped ? (
              <div>
                <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>
                  {currentItem.typeCategory || currentItem.pos}
                </span>
                <h2 style={{ fontSize: '2.25rem', color: 'var(--primary-600)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                  {currentItem.word}
                </h2>
                {currentItem.collocation && (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>
                    Collocation: {currentItem.collocation}
                  </p>
                )}
                <div style={{ marginTop: '1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  (แตะการ์ดเพื่อดูความหมายและข้อสอบจริง)
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {currentItem.meaningTh}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                  {currentItem.meaningEn}
                </p>

                <div style={{
                  backgroundColor: 'var(--bg-input)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  border: '1px solid var(--border-light)'
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary-600)', marginBottom: '0.25rem' }}>
                    Exam Example Sentence:
                  </div>
                  <div style={{ color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    "{currentItem.exampleSentence}"
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {currentItem.exampleTranslationTh}
                  </div>
                </div>

                {currentItem.examNote && (
                  <div style={{
                    marginTop: '0.75rem',
                    fontSize: '0.8rem',
                    color: 'var(--warning-text)',
                    backgroundColor: 'var(--warning-bg)',
                    padding: '0.4rem 0.65rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    💡 ข้อควรระวัง: {currentItem.examNote}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Flashcard Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginTop: '1rem' }}>
            <button 
              id="flashcard-btn-prev"
              className="btn btn-secondary" 
              onClick={handlePrevCard}
            >
              ย้อนกลับ
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                id="flashcard-btn-review"
                className="btn btn-danger"
                onClick={() => handleMarkStatus(currentItem.id, 'review')}
              >
                <X size={16} />
                ยังไม่แม่น (Need Review)
              </button>

              <button 
                id="flashcard-btn-known"
                className="btn btn-primary"
                onClick={() => handleMarkStatus(currentItem.id, 'known')}
              >
                <Check size={16} />
                จำได้แล้ว (I Know)
              </button>
            </div>

            <button 
              id="flashcard-btn-next"
              className="btn btn-secondary" 
              onClick={handleNextCard}
            >
              ถัดไป
            </button>
          </div>
        </div>
      ) : activeMode === 'table' ? (
        /* FULL VOCABULARY TABLE */
        <div className="card" style={{ overflowX: 'auto', padding: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-input)', borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Word / Phrase</th>
                <th style={{ padding: '0.85rem 1rem' }}>Part of Speech</th>
                <th style={{ padding: '0.85rem 1rem' }}>Meaning (Thai & English)</th>
                <th style={{ padding: '0.85rem 1rem' }}>Exam Example Sentence</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredVocab.map(item => {
                const status = stats.vocabularyStatus[item.id] || 'new';
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                      {item.word}
                      {item.typeCategory && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.typeCategory}</div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{item.pos}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600 }}>{item.meaningTh}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.meaningEn}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', maxWidth: '340px' }}>
                      <div style={{ fontSize: '0.85rem' }}>"{item.exampleSentence}"</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.exampleTranslationTh}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${status === 'known' ? 'badge-success' : status === 'review' ? 'badge-danger' : 'badge-neutral'}`}>
                        {status === 'known' ? 'จำได้แล้ว' : status === 'review' ? 'ต้องทบทวน' : 'ยังไม่ระบุ'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* QUIZ MODES B & C */
        currentItem && (
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div className="card">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Question {currentIndex + 1} of {filteredVocab.length}
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                {activeMode === 'meaning-to-word' ? (
                  <>เลือกคำศัพท์ที่ตรงกับความหมาย: <span style={{ color: 'var(--primary-600)', fontWeight: 800 }}>"{currentItem.meaningTh}"</span></>
                ) : (
                  <>เลือกความหมายที่ถูกต้องของคำว่า: <span style={{ color: 'var(--primary-600)', fontWeight: 800 }}>"{currentItem.word}"</span></>
                )}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {getQuizOptions(currentItem, activeMode as any).map((opt, i) => {
                  const isCorrectTarget = activeMode === 'meaning-to-word' ? opt === currentItem.word : opt === currentItem.meaningTh;
                  const isSelected = selectedAnswer === opt;
                  
                  let btnClass = 'option-btn';
                  if (isAnswerChecked) {
                    if (isCorrectTarget) btnClass += ' correct';
                    else if (isSelected && !isCorrectTarget) btnClass += ' incorrect';
                  } else if (isSelected) {
                    btnClass += ' selected';
                  }

                  return (
                    <button
                      key={i}
                      className={btnClass}
                      disabled={isAnswerChecked}
                      onClick={() => {
                        setSelectedAnswer(opt);
                        setIsAnswerChecked(true);
                        if (isCorrectTarget) {
                          handleMarkStatus(currentItem.id, 'known');
                        } else {
                          handleMarkStatus(currentItem.id, 'review');
                        }
                      }}
                    >
                      <span>{opt}</span>
                      {isAnswerChecked && isCorrectTarget && <Check size={18} color="var(--success)" />}
                      {isAnswerChecked && isSelected && !isCorrectTarget && <X size={18} color="var(--danger)" />}
                    </button>
                  );
                })}
              </div>

              {isAnswerChecked && (
                <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedAnswer(null);
                      setIsAnswerChecked(false);
                      handleNextCard();
                    }}
                  >
                    ข้อถัดไป
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};
