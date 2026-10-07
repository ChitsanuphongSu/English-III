import { describe, it, expect } from 'vitest';
import { QUESTIONS_BANK } from '../data/questions';
import { VOCABULARY_LIST } from '../data/vocabulary';
import { MOCK_EXAMS } from '../data/mockExams';
import { getInitialStats, recordQuestionAttempt, analyzeTopicPerformance, getDashboardSummary } from '../utils/analytics';

describe('English III Content & Logic Validation Tests', () => {
  it('Question Bank integrity: exact 156 questions, metadata complete and verified type breakdown', () => {
    expect(QUESTIONS_BANK.length).toBe(156);

    const questionIds = new Set<string>();
    const questionTexts = new Set<string>();
    const typeCounts: Record<string, number> = {};

    QUESTIONS_BANK.forEach(q => {
      // No duplicate ID
      expect(questionIds.has(q.id), `Duplicate question ID: ${q.id}`).toBe(false);
      questionIds.add(q.id);

      // No duplicate question text
      const normalizedText = q.question.trim().toLowerCase();
      expect(questionTexts.has(normalizedText), `Duplicate question text: "${q.question}"`).toBe(false);
      questionTexts.add(normalizedText);

      // Metadata completeness
      expect(q.unit).toBeDefined();
      expect(['unit3', 'unit4']).toContain(q.unit);
      expect(q.category).toBeDefined();
      expect(['Vocabulary', 'Grammar']).toContain(q.category);
      expect(q.topic).toBeDefined();
      expect(q.subtopic).toBeDefined();
      expect(q.difficulty).toBeDefined();
      expect(['easy', 'medium', 'hard']).toContain(q.difficulty);

      // Types
      expect(['multiple-choice', 'fill-blank', 'paragraph-context']).toContain(q.type);
      typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;

      // Explanations present in both English and Thai
      expect(q.explanationEn).toBeDefined();
      expect(q.explanationEn.length).toBeGreaterThan(10);
      expect(q.explanationTh).toBeDefined();
      expect(q.explanationTh.length).toBeGreaterThan(10);

      // Options and strictly contained answer
      expect(q.options.length).toBeGreaterThanOrEqual(4);
      const normalizedOpts = q.options.map(o => o.trim().toLowerCase());
      expect(normalizedOpts, `Answer "${q.answer}" not in options for Q ID: ${q.id}`).toContain(q.answer.trim().toLowerCase());
    });

    expect(typeCounts['multiple-choice']).toBe(108);
    expect(typeCounts['fill-blank']).toBe(16);
    expect(typeCounts['paragraph-context']).toBe(32);
  });

  it('Answer Key Distribution: no extreme bias towards a single letter/index', () => {
    const indexCounts = [0, 0, 0, 0]; // A, B, C, D

    QUESTIONS_BANK.forEach(q => {
      const idx = q.options.findIndex(opt => opt.trim().toLowerCase() === q.answer.trim().toLowerCase());
      expect(idx).toBeGreaterThanOrEqual(0);
      if (idx < 4) {
        indexCounts[idx]++;
      }
    });

    const total = QUESTIONS_BANK.length;
    // Each option (A, B, C, D) should represent at least 15% and at most 40% of the answers to avoid obvious clustering
    indexCounts.forEach((count, i) => {
      const ratio = count / total;
      expect(ratio, `Option index ${i} has ratio ${ratio.toFixed(2)} (count: ${count}/${total})`).toBeGreaterThan(0.15);
      expect(ratio, `Option index ${i} has ratio ${ratio.toFixed(2)} (count: ${count}/${total})`).toBeLessThan(0.40);
    });
  });

  it('Mock Exam Sets: 6 unique standard sets with low question overlap (<25%)', () => {
    expect(MOCK_EXAMS.length).toBeGreaterThanOrEqual(6);

    MOCK_EXAMS.forEach(mock => {
      expect(mock.questionIds.length).toBeGreaterThanOrEqual(20);
      // All referenced questions exist
      mock.questionIds.forEach(qId => {
        const found = QUESTIONS_BANK.find(q => q.id === qId);
        expect(found, `Mock ${mock.id} references missing question ID: ${qId}`).toBeDefined();
      });

      // No duplicate question inside the same mock
      const uniqueInMock = new Set(mock.questionIds);
      expect(uniqueInMock.size).toBe(mock.questionIds.length);
    });

    // Verify pairwise overlap between any two mocks is <= 25%
    for (let i = 0; i < MOCK_EXAMS.length; i++) {
      for (let j = i + 1; j < MOCK_EXAMS.length; j++) {
        const mockA = MOCK_EXAMS[i];
        const mockB = MOCK_EXAMS[j];
        const setA = new Set(mockA.questionIds);
        const overlap = mockB.questionIds.filter(id => setA.has(id)).length;
        const maxLen = Math.max(mockA.questionIds.length, mockB.questionIds.length);
        const overlapRatio = overlap / maxLen;

        expect(overlapRatio, `Overlap between Mock ${mockA.id} and Mock ${mockB.id} is ${(overlapRatio * 100).toFixed(1)}% (max allowed 25%)`).toBeLessThanOrEqual(0.25);
      }
    }
  });

  it('Vocabulary List integrity: has all Unit 3 and Unit 4 key terms from source PDFs', () => {
    expect(VOCABULARY_LIST.length).toBeGreaterThanOrEqual(30);

    const words = VOCABULARY_LIST.map(v => v.word.toLowerCase());
    // Unit 3 words
    expect(words).toContain('talent');
    expect(words).toContain('potential');
    expect(words).toContain('spectators');
    expect(words).toContain('victory');
    expect(words).toContain('referee');
    // Multi-word verbs
    expect(words).toContain('wake up');
    expect(words).toContain('wake sb up');
    expect(words).toContain('come up with sth');
    expect(words).toContain('get away with sth');
    // Unit 4 words
    expect(words).toContain('result in');
    expect(words).toContain('affect');
    expect(words).toContain('arduous');
    expect(words).toContain('rigorous');
    expect(words).toContain('gruelling');
  });

  it('Weakness Analysis and Minimum Attempts Logic', () => {
    const stats = getInitialStats();

    // With 0 attempts, topic should be untested
    let analysis = analyzeTopicPerformance(stats);
    expect(analysis['grammar-multiword'].confidence).toBe('insufficient');
    expect(analysis['grammar-multiword'].statusLevel).toBe('untested');

    // With 1 wrong attempt (< 3 attempts)
    let updatedStats = recordQuestionAttempt(stats, 'mwv-q-01', 'wrong_ans', false);
    analysis = analyzeTopicPerformance(updatedStats);
    expect(analysis['grammar-multiword'].confidence).toBe('insufficient');
    expect(analysis['grammar-multiword'].statusLevel).toBe('untested');

    // With 4 attempts (3 wrong, 1 correct => 25% accuracy)
    updatedStats = recordQuestionAttempt(updatedStats, 'mwv-q-02', 'wrong_ans', false);
    updatedStats = recordQuestionAttempt(updatedStats, 'mwv-q-03', 'wrong_ans', false);
    updatedStats = recordQuestionAttempt(updatedStats, 'mwv-q-04', 'stayed up', true);

    analysis = analyzeTopicPerformance(updatedStats);
    expect(analysis['grammar-multiword'].totalAttempts).toBe(4);
    expect(analysis['grammar-multiword'].accuracy).toBe(25);
    expect(analysis['grammar-multiword'].statusLevel).toBe('very-weak');
    expect(analysis['grammar-multiword'].confidence).toBe('low');

    // Dashboard summary should recommend reviewing this topic
    const summary = getDashboardSummary(updatedStats);
    expect(summary.weakestTopic?.topicId).toBe('grammar-multiword');
  });

  it('Recent Accuracy and Trend calculation', () => {
    let stats = getInitialStats();

    // Simulate 4 early wrong answers
    for (let i = 1; i <= 4; i++) {
      const qId = `mwv-q-0${i}`;
      stats = recordQuestionAttempt(stats, qId, 'wrong', false);
    }

    // Then simulate 6 consecutive correct answers on recent attempts
    for (let i = 5; i <= 9; i++) {
      const qId = `mwv-q-0${i}`;
      stats = recordQuestionAttempt(stats, qId, 'correct', true);
    }
    stats = recordQuestionAttempt(stats, 'mwv-q-10', 'correct', true);

    const analysis = analyzeTopicPerformance(stats);
    const mwv = analysis['grammar-multiword'];

    // Overall: 6 correct / 10 total = 60%
    expect(mwv.totalAttempts).toBe(10);
    expect(mwv.accuracy).toBe(60);

    // Recent 10 calculation: 6 correct out of 10 recent attempts = 60%
    expect(mwv.recentAccuracy).toBe(60);
    expect(mwv.trend).toBe('improving');

    // Simulate 10 more correct attempts to test 10-attempt windowing
    for (let i = 11; i <= 20; i++) {
      stats = recordQuestionAttempt(stats, `mwv-q-${i <= 30 ? i : '01'}`, 'correct', true);
    }
    const analysis20 = analyzeTopicPerformance(stats);
    expect(analysis20['grammar-multiword'].recentAccuracy).toBe(100);
    expect(analysis20['grammar-multiword'].totalAttempts).toBe(20);
  });

  it('Mock Exam Result Context Practice Accuracy: calculates from q.type === "paragraph-context"', () => {
    // Verify that paragraph-context questions exist and can be computed accurately
    const contextQuestions = QUESTIONS_BANK.filter(q => q.type === 'paragraph-context');
    expect(contextQuestions.length).toBeGreaterThanOrEqual(25);

    // Simulate a mock exam submission breakdown
    const mockSample = QUESTIONS_BANK.slice(0, 30);
    const answers: Record<string, string> = {};
    mockSample.forEach((q, idx) => {
      // make even indices correct, odd indices wrong
      answers[q.id] = idx % 2 === 0 ? q.answer : 'wrong_dummy_answer';
    });

    const categoryBreakdown = {
      Vocabulary: { correct: 0, total: 0 },
      Grammar: { correct: 0, total: 0 },
      Context: { correct: 0, total: 0 }
    };

    mockSample.forEach(q => {
      const isCorrect = answers[q.id]?.trim().toLowerCase() === q.answer.trim().toLowerCase();
      if (q.category === 'Vocabulary') {
        categoryBreakdown.Vocabulary.total++;
        if (isCorrect) categoryBreakdown.Vocabulary.correct++;
      }
      if (q.category === 'Grammar') {
        categoryBreakdown.Grammar.total++;
        if (isCorrect) categoryBreakdown.Grammar.correct++;
      }
      if (q.type === 'paragraph-context') {
        categoryBreakdown.Context.total++;
        if (isCorrect) categoryBreakdown.Context.correct++;
      }
    });

    expect(categoryBreakdown.Vocabulary.total).toBeGreaterThan(0);
    expect(categoryBreakdown.Grammar.total).toBeGreaterThan(0);
    expect(categoryBreakdown.Context.total).toBeGreaterThan(0);

    const contextAccuracy = Math.round((categoryBreakdown.Context.correct / categoryBreakdown.Context.total) * 100);
    expect(contextAccuracy).toBeGreaterThanOrEqual(0);
    expect(contextAccuracy).toBeLessThanOrEqual(100);
  });
});

