import { MockExam } from '../types';
import { QUESTIONS_BANK } from './questions';

export const MOCK_EXAMS: MockExam[] = [
  {
    id: 1,
    title: 'Mock Exam 1: Source Review Foundation',
    description: 'ชุดข้อสอบอ้างอิงตรงตามเอกสาร Final Exam Review (LI102003) ครบทั้ง Unit 3 และ Unit 4 พร้อมบริบทเนื้อเรื่อง A Writer\'s Life และ Learning to Love Running',
    timeLimitMinutes: 30,
    questionIds: [
      'src-rev-3v-01', 'src-rev-3v-02', 'src-rev-3v-03', 'src-rev-3v-04',
      'src-rev-3v-05', 'src-rev-3v-06', 'src-rev-3v-07', 'src-rev-3v-08',
      'src-rev-3v-09', 'src-rev-3v-10', 'src-rev-3v-11', 'src-rev-3v-12',
      'src-rev-3v-13', 'src-rev-3v-14', 'src-rev-3v-15', 'src-rev-3v-16',
      'src-rev-3g-17', 'src-rev-3g-18', 'src-rev-3g-19', 'src-rev-3g-20',
      'src-rev-3g-21', 'src-rev-3g-22', 'src-rev-3g-23', 'src-rev-3g-24',
      'src-rev-4v-01', 'src-rev-4v-02', 'src-rev-4v-03', 'src-rev-4v-04',
      'src-rev-4v-05', 'src-rev-4v-06', 'src-rev-4v-07', 'src-rev-4v-08',
      'src-rev-4g-17', 'src-rev-4g-18', 'src-rev-4g-19', 'src-rev-4g-20',
      'src-rev-4g-21', 'src-rev-4g-22', 'src-rev-4g-23', 'src-rev-4g-24'
    ]
  },
  {
    id: 2,
    title: 'Mock Exam 2: Multi-Word Verbs & Object Placement Focus',
    description: 'ชุดที่ 2 เน้นการทดสอบความแม่นยำของ Multi-word verbs 4 ประเภท การวาง Pronoun ตรงกลาง และกริยาวลีที่พบบ่อยในข้อสอบ',
    timeLimitMinutes: 25,
    questionIds: [
      'mwv-q-01', 'mwv-q-02', 'mwv-q-03', 'mwv-q-04', 'mwv-q-05',
      'mwv-q-06', 'mwv-q-07', 'mwv-q-08', 'mwv-q-09', 'mwv-q-10',
      'mwv-q-11', 'mwv-q-12', 'mwv-q-13', 'mwv-q-14', 'mwv-q-15',
      'mwv-q-16', 'mwv-q-17', 'mwv-q-18', 'mwv-q-19', 'mwv-q-20',
      'mwv-q-21', 'mwv-q-22', 'mwv-q-23', 'mwv-q-24', 'mwv-q-25',
      'mwv-q-26', 'mwv-q-27', 'mwv-q-28', 'mwv-q-29', 'mwv-q-30'
    ]
  },
  {
    id: 3,
    title: 'Mock Exam 3: Tense & Grammar Mastery (Tenses, Habits, Obligation)',
    description: 'ชุดที่ 3 เน้นการแยก Present Perfect vs Continuous, used to / would / be used to และ Obligation & Permission',
    timeLimitMinutes: 30,
    questionIds: [
      'pp-q-01', 'pp-q-02', 'pp-q-03', 'pp-q-04', 'pp-q-05',
      'pp-q-06', 'pp-q-07', 'pp-q-08', 'pp-q-09', 'pp-q-10',
      'pp-q-11', 'pp-q-12', 'used-q-01', 'used-q-02', 'used-q-03',
      'used-q-04', 'used-q-05', 'used-q-06', 'used-q-07', 'used-q-08',
      'used-q-09', 'used-q-10', 'ob-q-01', 'ob-q-02', 'ob-q-03',
      'ob-q-04', 'ob-q-05', 'ob-q-06', 'ob-q-07', 'ob-q-08'
    ]
  },
  {
    id: 4,
    title: 'Mock Exam 4: Cause, Result & Difficulty Vocabulary Focus',
    description: 'ชุดที่ 4 ทดสอบความแม่นยำของคำศัพท์ Unit 4A (Cause & Result) และ Unit 4B (Talking about Difficulty)',
    timeLimitMinutes: 25,
    questionIds: [
      'cr-q-01', 'cr-q-02', 'cr-q-03', 'cr-q-04', 'cr-q-05',
      'cr-q-06', 'cr-q-07', 'cr-q-08', 'src-rev-4v-09', 'src-rev-4v-10',
      'src-rev-4v-11', 'src-rev-4v-12', 'diff-q-01', 'diff-q-02', 'diff-q-03',
      'diff-q-04', 'diff-q-05', 'diff-q-06', 'diff-q-07', 'diff-q-08',
      'diff-q-09', 'diff-q-10', 'diff-q-11', 'src-rev-4v-13', 'src-rev-4v-14',
      'src-rev-4v-15', 'src-rev-4v-16'
    ]
  },
  {
    id: 5,
    title: 'Mock Exam 5: Ability & Achievement Vocabulary & Application',
    description: 'ชุดที่ 5 ทดสอบคำศัพท์ Unit 3A (Ability & Achievement) และ Collocation สำคัญในรูปประโยคหลากหลาย',
    timeLimitMinutes: 25,
    questionIds: [
      'ab-q-01', 'ab-q-02', 'ab-q-03', 'ab-q-04', 'ab-q-05',
      'ab-q-06', 'ab-q-07', 'ab-q-08', 'ab-q-09', 'ab-q-10',
      'ab-q-11', 'ab-q-12', 'ab-q-13', 'ab-q-14', 'ab-q-15',
      'ab-q-16', 'ab-q-17', 'mwv-q-09', 'mwv-q-14', 'mwv-q-24',
      'pp-q-01', 'pp-q-04', 'used-q-01', 'used-q-05', 'ob-q-01'
    ]
  },
  {
    id: 6,
    title: 'Mock Exam 6: Comprehensive Final Speed & Accuracy Drill (Traps Focus)',
    description: 'ชุดที่ 6 รวบรวมข้อสอบกับดักยอดฮิต (Exam Traps) และข้อสอบประยุกต์ Unit 3-4 ในรูปแบบข้อสอบคละมาตรฐาน Final Exam',
    timeLimitMinutes: 30,
    questionIds: [
      'trap-q-01', 'trap-q-02', 'trap-q-03', 'trap-q-04', 'trap-q-05',
      'trap-q-06', 'trap-q-07', 'trap-q-08', 'trap-q-09', 'trap-q-10',
      'trap-q-11', 'trap-q-12', 'mwv-q-02', 'mwv-q-11', 'mwv-q-17',
      'mwv-q-26', 'mwv-q-30', 'pp-q-05', 'pp-q-09', 'pp-q-11',
      'used-q-03', 'used-q-06', 'ob-q-03', 'ob-q-06', 'cr-q-01',
      'cr-q-04', 'diff-q-01', 'diff-q-02', 'ab-q-06', 'ab-q-09'
    ]
  }
];

// Function to get questions for a mock exam
export const getQuestionsForMock = (mockId: number) => {
  const mock = MOCK_EXAMS.find(m => m.id === mockId);
  if (!mock) return [];
  return mock.questionIds
    .map(qId => QUESTIONS_BANK.find(q => q.id === qId))
    .filter(Boolean);
};
