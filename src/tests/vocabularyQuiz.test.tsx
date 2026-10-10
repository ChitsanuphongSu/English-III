import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { VocabularyView } from '../components/VocabularyView';
import { VOCABULARY_LIST } from '../data/vocabulary';
import { UserStats } from '../types';

// Mock localStorage for saveUserStats
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

function makeEmptyStats(): UserStats {
  return {
    vocabularyStatus: {},
    vocabAttempts: {},
    questionAttempts: {},
    attemptLog: [],
    mistakes: {},
    mockAttempts: [],
    practiceHistory: [],
  };
}

describe('VocabularyView — Quiz Regression Tests', () => {
  let stats: UserStats;
  let onUpdateStats: ReturnType<typeof vi.fn<(newStats: UserStats) => void>>;

  beforeEach(() => {
    stats = makeEmptyStats();
    onUpdateStats = vi.fn<(newStats: UserStats) => void>((newStats: UserStats) => {
      // Simulate parent state update
      stats = newStats;
    });
    localStorageMock.clear();
  });

  // ───── HELPER: render in a specific quiz mode ─────
  function renderInQuizMode(mode: 'meaning-to-word' | 'word-to-meaning') {
    const { rerender } = render(
      <VocabularyView stats={stats} onUpdateStats={onUpdateStats} />
    );

    // Click the mode button
    const modeButtonId = mode === 'meaning-to-word' ? 'vocab-mode-meaning-to-word' : 'vocab-mode-word-to-meaning';
    fireEvent.click(screen.getByText(mode === 'meaning-to-word' ? 'Meaning → Word Quiz' : 'Word → Meaning Quiz'));

    return {
      rerender: () => rerender(<VocabularyView stats={stats} onUpdateStats={onUpdateStats} />),
    };
  }

  // ───── HELPER: get question number from the "Question X of Y" text ─────
  function getCurrentQuestionNumber(): number {
    const questionText = screen.getByText(/Question \d+ of \d+/);
    const match = questionText.textContent?.match(/Question (\d+)/);
    return match ? parseInt(match[1], 10) : -1;
  }

  // ───── HELPER: get all option button texts ─────
  function getOptionTexts(): string[] {
    const optionButtons = screen.getAllByRole('button').filter(btn =>
      btn.classList.contains('option-btn')
    );
    return optionButtons.map(btn => {
      // Get the text content of the span inside the button
      const span = btn.querySelector('span');
      return span?.textContent ?? btn.textContent ?? '';
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // TEST 1: Meaning → Word Quiz — no question skipping
  // ═══════════════════════════════════════════════════════════════════
  it('TEST 1: Meaning→Word quiz stays on Question 1 after answering, then advances to Question 2 on Next', () => {
    renderInQuizMode('meaning-to-word');

    // Verify we start on Question 1
    expect(getCurrentQuestionNumber()).toBe(1);

    // Click the first option (any answer)
    const optionButtons = screen.getAllByRole('button').filter(btn =>
      btn.classList.contains('option-btn')
    );
    expect(optionButtons.length).toBeGreaterThanOrEqual(4);
    fireEvent.click(optionButtons[0]);

    // CRITICAL: Must still be on Question 1
    expect(getCurrentQuestionNumber()).toBe(1);

    // Verify feedback is displayed (Next Question button appears)
    const nextBtn = screen.getByText('ข้อถัดไป');
    expect(nextBtn).toBeDefined();

    // Click Next Question
    fireEvent.click(nextBtn);

    // Must now be on Question 2 (NOT Question 3)
    expect(getCurrentQuestionNumber()).toBe(2);
  });

  // ═══════════════════════════════════════════════════════════════════
  // TEST 2: Word → Meaning Quiz — no question skipping
  // ═══════════════════════════════════════════════════════════════════
  it('TEST 2: Word→Meaning quiz stays on Question 1 after answering, then advances to Question 2 on Next', () => {
    renderInQuizMode('word-to-meaning');

    // Verify we start on Question 1
    expect(getCurrentQuestionNumber()).toBe(1);

    // Click the first option
    const optionButtons = screen.getAllByRole('button').filter(btn =>
      btn.classList.contains('option-btn')
    );
    fireEvent.click(optionButtons[0]);

    // Must still be on Question 1
    expect(getCurrentQuestionNumber()).toBe(1);

    // Click Next Question
    fireEvent.click(screen.getByText('ข้อถัดไป'));

    // Must be on Question 2
    expect(getCurrentQuestionNumber()).toBe(2);
  });

  // ═══════════════════════════════════════════════════════════════════
  // TEST 3: Stable options — options don't reshuffle after answering
  // ═══════════════════════════════════════════════════════════════════
  it('TEST 3: Quiz options remain identical in same order after answer selection', () => {
    renderInQuizMode('meaning-to-word');

    // Capture options before answering
    const optionsBefore = getOptionTexts();
    expect(optionsBefore.length).toBeGreaterThanOrEqual(4);

    // Click the first option
    const optionButtons = screen.getAllByRole('button').filter(btn =>
      btn.classList.contains('option-btn')
    );
    fireEvent.click(optionButtons[0]);

    // Capture options after answering
    const optionsAfter = getOptionTexts();

    // Options must be identical and in the same order
    expect(optionsAfter).toEqual(optionsBefore);
  });

  // ═══════════════════════════════════════════════════════════════════
  // TEST 4: No double submission
  // ═══════════════════════════════════════════════════════════════════
  it('TEST 4: Cannot submit a second answer after already answering', () => {
    renderInQuizMode('meaning-to-word');

    const optionButtons = screen.getAllByRole('button').filter(btn =>
      btn.classList.contains('option-btn')
    );

    // Answer with first option
    fireEvent.click(optionButtons[0]);

    // Record how many times onUpdateStats was called
    const callCountAfterFirst = onUpdateStats.mock.calls.length;

    // Try clicking a different option
    fireEvent.click(optionButtons[1]);

    // onUpdateStats should NOT have been called again
    expect(onUpdateStats.mock.calls.length).toBe(callCountAfterFirst);

    // All option buttons should be disabled
    optionButtons.forEach(btn => {
      expect((btn as HTMLButtonElement).disabled).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // TEST 5: Flashcard regression — Known marks status and advances
  // ═══════════════════════════════════════════════════════════════════
  it('TEST 5: Flashcard Known button saves status and advances to next card', () => {
    render(<VocabularyView stats={stats} onUpdateStats={onUpdateStats} />);

    // Default mode is flashcard
    const firstCardText = screen.getByText(/Card 1 of/);
    expect(firstCardText).toBeDefined();

    const firstVocabWord = VOCABULARY_LIST[0].word;
    expect(screen.getByText(firstVocabWord)).toBeDefined();

    // Click Known
    fireEvent.click(screen.getByText(/จำได้แล้ว/));

    // Status should be updated
    expect(onUpdateStats).toHaveBeenCalled();
    const updatedStats = onUpdateStats.mock.calls[0][0] as UserStats;
    expect(updatedStats.vocabularyStatus[VOCABULARY_LIST[0].id]).toBe('known');

    // Should advance to Card 2
    expect(screen.getByText(/Card 2 of/)).toBeDefined();
  });

  // ═══════════════════════════════════════════════════════════════════
  // TEST 6: Topic/filter changes clear quiz feedback
  // ═══════════════════════════════════════════════════════════════════
  it('TEST 6: Changing topic clears quiz feedback and shows first question', () => {
    const { rerender } = render(
      <VocabularyView stats={stats} onUpdateStats={onUpdateStats} />
    );

    // Switch to quiz mode
    fireEvent.click(screen.getByText('Meaning → Word Quiz'));
    expect(getCurrentQuestionNumber()).toBe(1);

    // Answer a question
    const optionButtons = screen.getAllByRole('button').filter(btn =>
      btn.classList.contains('option-btn')
    );
    fireEvent.click(optionButtons[0]);
    expect(screen.getByText('ข้อถัดไป')).toBeDefined();

    // Change topic filter
    const topicSelect = screen.getByDisplayValue(/ทุกหัวข้อ/);
    fireEvent.change(topicSelect, { target: { value: 'vocab-ability' } });

    // Feedback should be cleared — "Next Question" button should be gone
    expect(screen.queryByText('ข้อถัดไป')).toBeNull();

    // Should be back on Question 1
    expect(getCurrentQuestionNumber()).toBe(1);
  });

  // ═══════════════════════════════════════════════════════════════════
  // TEST 7: Quiz mode switching clears stale state
  // ═══════════════════════════════════════════════════════════════════
  it('TEST 7: Switching quiz mode clears stale answer and feedback', () => {
    render(<VocabularyView stats={stats} onUpdateStats={onUpdateStats} />);

    // Enter Meaning → Word mode
    fireEvent.click(screen.getByText('Meaning → Word Quiz'));

    // Answer a question
    const optionButtons = screen.getAllByRole('button').filter(btn =>
      btn.classList.contains('option-btn')
    );
    fireEvent.click(optionButtons[0]);

    // Verify feedback is showing
    expect(screen.getByText('ข้อถัดไป')).toBeDefined();

    // Switch to Word → Meaning mode
    fireEvent.click(screen.getByText('Word → Meaning Quiz'));

    // Stale feedback should be gone
    expect(screen.queryByText('ข้อถัดไป')).toBeNull();

    // Options should be clickable (not disabled)
    const newOptionButtons = screen.getAllByRole('button').filter(btn =>
      btn.classList.contains('option-btn')
    );
    newOptionButtons.forEach(btn => {
      expect((btn as HTMLButtonElement).disabled).toBe(false);
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // TEST 8: Final question is answerable
  // ═══════════════════════════════════════════════════════════════════
  it('TEST 8: Final question can be answered and shows correct feedback', () => {
    // Use a small filtered set by selecting a specific topic
    render(<VocabularyView stats={stats} onUpdateStats={onUpdateStats} />);

    // Switch to Meaning → Word quiz
    fireEvent.click(screen.getByText('Meaning → Word Quiz'));

    // Filter to a small topic to reach the last question faster
    const topicSelect = screen.getByDisplayValue(/ทุกหัวข้อ/);
    fireEvent.change(topicSelect, { target: { value: 'vocab-cause-result' } });

    // Get the total number of questions
    const questionText = screen.getByText(/Question \d+ of (\d+)/);
    const totalMatch = questionText.textContent?.match(/of (\d+)/);
    const totalQuestions = totalMatch ? parseInt(totalMatch[1], 10) : 0;
    expect(totalQuestions).toBeGreaterThanOrEqual(2);

    // Navigate to the last question by answering and clicking Next
    for (let i = 1; i < totalQuestions; i++) {
      const optBtns = screen.getAllByRole('button').filter(btn =>
        btn.classList.contains('option-btn')
      );
      fireEvent.click(optBtns[0]); // Answer
      fireEvent.click(screen.getByText('ข้อถัดไป')); // Next
    }

    // Now we should be on the last question
    expect(getCurrentQuestionNumber()).toBe(totalQuestions);

    // Answer the last question
    const lastOptionBtns = screen.getAllByRole('button').filter(btn =>
      btn.classList.contains('option-btn')
    );
    fireEvent.click(lastOptionBtns[0]);

    // Must remain on the last question showing feedback
    expect(getCurrentQuestionNumber()).toBe(totalQuestions);

    // Feedback must be visible
    expect(screen.getByText('ข้อถัดไป')).toBeDefined();

    // Clicking Next should wrap to Question 1
    fireEvent.click(screen.getByText('ข้อถัดไป'));
    expect(getCurrentQuestionNumber()).toBe(1);
  });
});
