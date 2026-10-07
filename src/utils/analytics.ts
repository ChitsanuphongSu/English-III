import { UserStats, TopicId, Category, MockExamAttempt, QuestionMistakeRecord } from '../types';
import { TOPICS, VOCABULARY_LIST } from '../data/vocabulary';
import { QUESTIONS_BANK } from '../data/questions';

const STORAGE_KEY = 'eng3_exam_prep_stats_v1';

export const getInitialStats = (): UserStats => {
  return {
    vocabularyStatus: {},
    vocabAttempts: {},
    questionAttempts: {},
    attemptLog: [],
    mistakes: {},
    mockAttempts: [],
    practiceHistory: []
  };
};

export const loadUserStats = (): UserStats => {
  try {
    if (typeof localStorage === 'undefined') return getInitialStats();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialStats();
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load user stats from localStorage:', err);
    return getInitialStats();
  }
};

export const saveUserStats = (stats: UserStats): void => {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save user stats to localStorage:', err);
  }
};

export const resetUserStats = (): void => {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset stats:', err);
  }
};

// ==========================================
// WEAKNESS CALCULATION & TOPIC ACCURACY
// ==========================================

export interface TopicAnalysisResult {
  topicId: TopicId;
  name: string;
  nameTh: string;
  category: Category;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number; // 0 to 100
  recentAccuracy: number; // based on latest 10 attempts
  trend: 'improving' | 'stable' | 'declining' | 'untested';
  trendLabelTh: string;
  confidence: 'insufficient' | 'low' | 'medium' | 'high';
  statusLevel: 'strong' | 'needs-practice' | 'weak' | 'very-weak' | 'untested';
  statusLabelTh: string;
  recommendationTh: string;
}

export const analyzeTopicPerformance = (stats: UserStats): Record<TopicId, TopicAnalysisResult> => {
  const result: Record<TopicId, TopicAnalysisResult> = {} as any;
  const attemptLog = stats.attemptLog || [];

  TOPICS.forEach(topic => {
    let totalAttempts = 0;
    let correctAttempts = 0;

    // 1. Gather stats from question attempts
    Object.entries(stats.questionAttempts).forEach(([qId, qData]) => {
      const q = QUESTIONS_BANK.find(item => item.id === qId);
      if (q && q.topic === topic.id) {
        totalAttempts += qData.total;
        correctAttempts += qData.correct;
      }
    });

    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    // Calculate recent accuracy using attemptLog (latest 10 attempts for this topic)
    const topicLogs = attemptLog.filter(l => l.topic === topic.id);
    const recentLogs = topicLogs.slice(-10);
    const recentTotal = recentLogs.length;
    const recentCorrect = recentLogs.filter(l => l.isCorrect).length;
    const recentAccuracy = recentTotal > 0 ? Math.round((recentCorrect / recentTotal) * 100) : accuracy;

    // Trend calculation: compare latest attempts against earlier attempts
    let trend: 'improving' | 'stable' | 'declining' | 'untested' = 'untested';
    let trendLabelTh = '—';
    if (topicLogs.length >= 3) {
      let priorAccuracy = accuracy;
      if (topicLogs.length > 10) {
        const priorLogs = topicLogs.slice(0, -10);
        priorAccuracy = Math.round((priorLogs.filter(l => l.isCorrect).length / priorLogs.length) * 100);
      } else if (topicLogs.length >= 4) {
        // When between 4 and 10 attempts, compare the second half vs first half
        const mid = Math.floor(topicLogs.length / 2);
        const firstHalf = topicLogs.slice(0, mid);
        const secondHalf = topicLogs.slice(mid);
        priorAccuracy = Math.round((firstHalf.filter(l => l.isCorrect).length / firstHalf.length) * 100);
        const secondHalfAcc = Math.round((secondHalf.filter(l => l.isCorrect).length / secondHalf.length) * 100);
        
        if (secondHalfAcc >= priorAccuracy + 10) {
          trend = 'improving';
          trendLabelTh = '↑ กำลังพัฒนาขึ้น (Improving)';
        } else if (secondHalfAcc <= priorAccuracy - 10) {
          trend = 'declining';
          trendLabelTh = '↓ มีแนวโน้มลดลง (Declining)';
        } else {
          trend = 'stable';
          trendLabelTh = '→ สม่ำเสมอ (Stable)';
        }
      }

      if (topicLogs.length > 10) {
        if (recentAccuracy >= priorAccuracy + 5) {
          trend = 'improving';
          trendLabelTh = '↑ กำลังพัฒนาขึ้น (Improving)';
        } else if (recentAccuracy <= priorAccuracy - 5) {
          trend = 'declining';
          trendLabelTh = '↓ มีแนวโน้มลดลง (Declining)';
        } else {
          trend = 'stable';
          trendLabelTh = '→ สม่ำเสมอ (Stable)';
        }
      }
    }

    // Confidence assessment based on sample size:
    // < 3: insufficient data
    // 3 - 5: low (needs more practice)
    // 6 - 10: medium
    // > 10: high confidence
    let confidence: 'insufficient' | 'low' | 'medium' | 'high' = 'insufficient';
    if (totalAttempts >= 11) confidence = 'high';
    else if (totalAttempts >= 6) confidence = 'medium';
    else if (totalAttempts >= 3) confidence = 'low';

    // Status Level
    let statusLevel: 'strong' | 'needs-practice' | 'weak' | 'very-weak' | 'untested' = 'untested';
    let statusLabelTh = 'ยังไม่มีข้อมูลเพียงพอ';
    let recommendationTh = 'ทำข้อสอบหรือแบบฝึกหัดเพื่อประเมินผล';

    if (totalAttempts === 0) {
      statusLevel = 'untested';
      statusLabelTh = 'ยังไม่เคยทดสอบ';
      recommendationTh = `เริ่มทำแบบฝึกหัดหัวข้อ ${topic.name} เพื่อทดสอบพื้นฐาน`;
    } else if (totalAttempts < 3) {
      statusLevel = 'untested';
      statusLabelTh = `ข้อมูลยังน้อย (${totalAttempts}/3 ข้อ)`;
      recommendationTh = `ทำเพิ่มอีกอย่างน้อย ${3 - totalAttempts} ข้อเพื่อประเมินความแม่นยำ`;
    } else {
      if (accuracy >= 80) {
        statusLevel = 'strong';
        statusLabelTh = '🟢 แม่นยำดีมาก (Strong)';
        recommendationTh = 'รักษาความแม่นยำไว้ และทบทวนอย่างสม่ำเสมอ';
      } else if (accuracy >= 65) {
        statusLevel = 'needs-practice';
        statusLabelTh = '🟡 ปานกลาง (Needs Practice)';
        recommendationTh = `ฝึกโจทย์ Context ของ ${topic.name} เพิ่มเติมเพื่อขยับเป็น 80%+`;
      } else if (accuracy >= 50) {
        statusLevel = 'weak';
        statusLabelTh = '🟠 อ่อน (Weak)';
        recommendationTh = `กลับไปอ่านสรุปกฎและตัวอย่างใน Study Mode ก่อนฝึกซ้ำ`;
      } else {
        statusLevel = 'very-weak';
        statusLabelTh = '🔴 อ่อนมาก (Very Weak)';
        recommendationTh = `จำเป็นต้องทบทวน Common Traps และทำแบบฝึกหัดแก้จุดผิดด่วน!`;
      }
    }

    result[topic.id] = {
      topicId: topic.id,
      name: topic.name,
      nameTh: topic.nameTh,
      category: topic.category,
      totalAttempts,
      correctAttempts,
      accuracy,
      recentAccuracy,
      trend,
      trendLabelTh,
      confidence,
      statusLevel,
      statusLabelTh,
      recommendationTh
    };
  });

  return result;
};

// ==========================================
// OVERALL DASHBOARD SUMMARY
// ==========================================

export interface DashboardSummary {
  hasEnoughData: boolean;
  overallAccuracy: number;
  vocabAccuracy: number;
  grammarAccuracy: number;
  contextAccuracy: number;
  mockAverageScore: number;
  mockBestScore: number;
  mockLatestScore: number;
  totalMocksCompleted: number;
  totalQuestionsAnswered: number;
  knownVocabCount: number;
  totalVocabCount: number;
  weakestTopic: TopicAnalysisResult | null;
  strongestTopic: TopicAnalysisResult | null;
  nextRecommendedAction: {
    titleTh: string;
    descriptionTh: string;
    topicId?: TopicId;
    actionType: 'study' | 'practice' | 'mock' | 'review-mistakes';
    targetId?: string | number;
  };
}

export const getDashboardSummary = (stats: UserStats): DashboardSummary => {
  const topicAnalysis = analyzeTopicPerformance(stats);
  const totalVocabCount = VOCABULARY_LIST.length;
  
  let knownVocabCount = 0;
  Object.values(stats.vocabularyStatus).forEach(status => {
    if (status === 'known') knownVocabCount++;
  });

  let totalQ = 0;
  let correctQ = 0;
  let vocabQ = 0, vocabCorrect = 0;
  let grammarQ = 0, grammarCorrect = 0;
  let contextQ = 0, contextCorrect = 0;

  Object.entries(stats.questionAttempts).forEach(([qId, data]) => {
    const q = QUESTIONS_BANK.find(item => item.id === qId);
    if (q) {
      totalQ += data.total;
      correctQ += data.correct;

      if (q.category === 'Vocabulary') {
        vocabQ += data.total;
        vocabCorrect += data.correct;
      } else if (q.category === 'Grammar') {
        grammarQ += data.total;
        grammarCorrect += data.correct;
      }

      if (q.type === 'paragraph-context') {
        contextQ += data.total;
        contextCorrect += data.correct;
      }
    }
  });

  const overallAccuracy = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0;
  const vocabAccuracy = vocabQ > 0 ? Math.round((vocabCorrect / vocabQ) * 100) : 0;
  const grammarAccuracy = grammarQ > 0 ? Math.round((grammarCorrect / grammarQ) * 100) : 0;
  const contextAccuracy = contextQ > 0 ? Math.round((contextCorrect / contextQ) * 100) : 0;

  const mockAttempts = stats.mockAttempts || [];
  const totalMocksCompleted = mockAttempts.length;
  let mockAverageScore = 0;
  let mockBestScore = 0;
  let mockLatestScore = 0;

  if (totalMocksCompleted > 0) {
    const sum = mockAttempts.reduce((acc, m) => acc + m.percentage, 0);
    mockAverageScore = Math.round(sum / totalMocksCompleted);
    mockBestScore = Math.max(...mockAttempts.map(m => m.percentage));
    mockLatestScore = mockAttempts[mockAttempts.length - 1].percentage;
  }

  // Find weakest & strongest among tested topics with at least 3 attempts
  const testedTopics = Object.values(topicAnalysis).filter(t => t.totalAttempts >= 3);
  
  let weakestTopic: TopicAnalysisResult | null = null;
  let strongestTopic: TopicAnalysisResult | null = null;

  if (testedTopics.length > 0) {
    testedTopics.sort((a, b) => a.accuracy - b.accuracy);
    weakestTopic = testedTopics[0];
    strongestTopic = testedTopics[testedTopics.length - 1];
  }

  // Determine intelligent "What should I study next?"
  let nextRecommendedAction: DashboardSummary['nextRecommendedAction'] = {
    titleTh: 'เริ่มต้นทำ Mock Exam 1',
    descriptionTh: 'ทดสอบวัดระดับครั้งแรกเพื่อค้นหาจุดแข็งและจุดอ่อนของคุณ',
    actionType: 'mock',
    targetId: 1
  };

  const mistakeCount = Object.keys(stats.mistakes).length;

  if (totalMocksCompleted === 0 && totalQ < 10) {
    nextRecommendedAction = {
      titleTh: 'เริ่มต้นทำ Mock Exam 1 (Review ฉบับจริง)',
      descriptionTh: 'เริ่มทำข้อสอบเสมือนจริงชุดที่ 1 เพื่อตรวจระดับความพร้อมรอบด้าน',
      actionType: 'mock',
      targetId: 1
    };
  } else if (mistakeCount >= 4) {
    nextRecommendedAction = {
      titleTh: `ทบทวนข้อที่เคยทำผิด (${mistakeCount} ข้อที่ตอบผิด)`,
      descriptionTh: 'ฝึกฝนแก้ข้อผิดพลาดที่สะสมไว้เพื่อไม่ให้เสียคะแนนซ้ำในข้อสอบจริง',
      actionType: 'review-mistakes'
    };
  } else if (weakestTopic && weakestTopic.accuracy < 70) {
    nextRecommendedAction = {
      titleTh: `ทบทวนหัวข้อ ${weakestTopic.nameTh}`,
      descriptionTh: `ความแม่นยำปัจจุบัน ${weakestTopic.accuracy}% (Recent: ${weakestTopic.recentAccuracy}%) — อ่านสรุปและฝึกข้อสอบเจาะจง`,
      topicId: weakestTopic.topicId,
      actionType: 'study',
      targetId: weakestTopic.topicId
    };
  } else if (totalMocksCompleted < 6) {
    const nextMockNum = totalMocksCompleted + 1;
    nextRecommendedAction = {
      titleTh: `ทำ Mock Exam ชุดที่ ${nextMockNum}`,
      descriptionTh: 'ลุยข้อสอบชุดถัดไปเพื่อฝึกฝนการทำข้อสอบแบบจับเวลาจริง',
      actionType: 'mock',
      targetId: nextMockNum
    };
  } else {
    nextRecommendedAction = {
      titleTh: 'ทำแบบฝึกหัด Speed & Accuracy Drill (Traps)',
      descriptionTh: 'คุณทำ Mock ครบแล้ว! ฝึกซ้ำจุดที่ต้องการความเร็วและความแม่นยำสูงสุด',
      actionType: 'mock',
      targetId: 6
    };
  }

  return {
    hasEnoughData: totalQ >= 5 || totalMocksCompleted > 0,
    overallAccuracy,
    vocabAccuracy,
    grammarAccuracy,
    contextAccuracy,
    mockAverageScore,
    mockBestScore,
    mockLatestScore,
    totalMocksCompleted,
    totalQuestionsAnswered: totalQ,
    knownVocabCount,
    totalVocabCount,
    weakestTopic,
    strongestTopic,
    nextRecommendedAction
  };
};

// ==========================================
// RECORDING ATTEMPTS & MISTAKES
// ==========================================

export const recordQuestionAttempt = (
  stats: UserStats,
  questionId: string,
  userAnswer: string,
  isCorrect: boolean
): UserStats => {
  const currentQ = stats.questionAttempts[questionId] || { correct: 0, total: 0, lastAnswer: '' };
  const updatedQ = {
    total: currentQ.total + 1,
    correct: currentQ.correct + (isCorrect ? 1 : 0),
    lastAnswer: userAnswer
  };

  const newAttempts = { ...stats.questionAttempts, [questionId]: updatedQ };
  const newMistakes = { ...stats.mistakes };
  const qObj = QUESTIONS_BANK.find(q => q.id === questionId);

  // Update Attempt Log for Recent Accuracy
  const newAttemptLog = [...(stats.attemptLog || [])];
  if (qObj) {
    newAttemptLog.push({
      questionId,
      topic: qObj.topic,
      isCorrect,
      timestamp: Date.now()
    });
    // Keep last 200 attempts in memory
    if (newAttemptLog.length > 200) {
      newAttemptLog.shift();
    }
  }

  if (!isCorrect && qObj) {
    const currentMistake: QuestionMistakeRecord = newMistakes[questionId] || {
      questionId,
      userAnswer,
      correctAnswer: qObj.answer,
      timesWrong: 0,
      lastAttempted: Date.now(),
      topic: qObj.topic
    };

    newMistakes[questionId] = {
      ...currentMistake,
      userAnswer,
      timesWrong: currentMistake.timesWrong + 1,
      lastAttempted: Date.now()
    };
  } else if (isCorrect && newMistakes[questionId]) {
    delete newMistakes[questionId];
  }

  const newStats: UserStats = {
    ...stats,
    questionAttempts: newAttempts,
    attemptLog: newAttemptLog,
    mistakes: newMistakes
  };

  saveUserStats(newStats);
  return newStats;
};

export const recordMockSubmission = (
  stats: UserStats,
  attempt: MockExamAttempt
): UserStats => {
  let updatedStats = { ...stats };

  // Record each question answer
  Object.entries(attempt.userAnswers).forEach(([qId, ans]) => {
    const q = QUESTIONS_BANK.find(item => item.id === qId);
    if (q) {
      const isCorrect = ans.trim().toLowerCase() === q.answer.trim().toLowerCase();
      updatedStats = recordQuestionAttempt(updatedStats, qId, ans, isCorrect);
    }
  });

  // Append attempt
  updatedStats.mockAttempts = [...(updatedStats.mockAttempts || []), attempt];
  saveUserStats(updatedStats);
  return updatedStats;
};
