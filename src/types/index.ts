export type UnitId = 'unit3' | 'unit4';

export type Category = 'Vocabulary' | 'Grammar' | 'Context';

export type TopicId = 
  | 'vocab-ability'
  | 'vocab-cause-result'
  | 'vocab-difficulty'
  | 'grammar-multiword'
  | 'grammar-present-perf'
  | 'grammar-used-to'
  | 'grammar-obligation';

export interface TopicMeta {
  id: TopicId;
  unit: UnitId;
  name: string;
  nameTh: string;
  category: Category;
  description: string;
  keyFormula?: string;
  iconName: string;
}

export interface VocabItem {
  id: string;
  word: string;
  pos: string; // noun, verb, adjective, phrase, multi-word verb
  topic: TopicId;
  unit: UnitId;
  meaningEn: string;
  meaningTh: string;
  collocation?: string;
  exampleSentence: string;
  exampleTranslationTh: string;
  typeCategory?: string; // For multi-word: Type 1, Type 2, Type 3, Type 4
  examNote?: string;
  confusingWith?: string[];
}

export interface Question {
  id: string;
  unit: UnitId;
  category: Category;
  topic: TopicId;
  subtopic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple-choice' | 'fill-blank' | 'paragraph-context' | 'error-identification';
  question: string;
  options: string[];
  answer: string; // Exact match to one of options
  explanationEn: string;
  explanationTh: string;
  trapWarning?: string;
  paragraphText?: string;
  mockExamIds?: number[]; // which standard mocks include this question, or central pool
}

export interface MockExam {
  id: number;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questionIds: string[];
}

export interface UserAnswerRecord {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timestamp: number;
  timeSpentSeconds?: number;
}

export interface MockExamAttempt {
  id: string;
  mockId: number;
  date: string;
  timestamp: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  topicBreakdown: Record<TopicId, { total: number; correct: number; percentage: number }>;
  categoryBreakdown: Record<Category, { total: number; correct: number; percentage: number }>;
  userAnswers: Record<string, string>; // questionId -> selectedOption
}

export interface QuestionMistakeRecord {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  timesWrong: number;
  lastAttempted: number;
  topic: TopicId;
}

export interface UserStats {
  vocabularyStatus: Record<string, 'new' | 'learning' | 'known' | 'review'>; // vocabId -> status
  vocabAttempts: Record<string, { correct: number; total: number }>;
  questionAttempts: Record<string, { correct: number; total: number; lastAnswer: string }>;
  attemptLog?: {
    questionId: string;
    topic: TopicId;
    isCorrect: boolean;
    timestamp: number;
  }[];
  mistakes: Record<string, QuestionMistakeRecord>;
  mockAttempts: MockExamAttempt[];
  practiceHistory: {
    timestamp: number;
    topicId?: TopicId;
    mode: string;
    total: number;
    correct: number;
  }[];
}
