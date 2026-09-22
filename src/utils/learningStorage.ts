// src/utils/learningStorage.ts
// Unified storage and progress tracking for Synthreat Learning Paths and Quizzes

export interface PathProgressState {
  completed: string[]; // array of article identifiers, e.g. "vulnerabilities/sql-injection"
  lastUpdated: string;
}

export type AllPathsProgress = Record<string, PathProgressState>;

export interface QuizScoreRecord {
  score: number;
  total: number;
  passed: boolean;
  date: string;
  selectedAnswers?: number[];
}

export type AllQuizScores = Record<string, QuizScoreRecord>;

export const PATH_STORAGE_KEY = 'synthreat_path_progress';
export const QUIZ_STORAGE_KEY = 'synthreat_quiz_scores';

// ── Path Progress API ────────────────────────────────────────────────────────

export function getAllPathProgress(): AllPathsProgress {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PATH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getPathCompletedArticles(pathSlug: string): string[] {
  const all = getAllPathProgress();
  return all[pathSlug]?.completed || [];
}

export function isArticleCompletedInPath(pathSlug: string, articleId: string): boolean {
  const completed = getPathCompletedArticles(pathSlug);
  return completed.includes(articleId);
}

export function setArticleCompletedInPath(pathSlug: string, articleId: string, isCompleted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    const all = getAllPathProgress();
    const current = all[pathSlug]?.completed || [];
    let updated: string[];

    if (isCompleted) {
      updated = current.includes(articleId) ? current : [...current, articleId];
    } else {
      updated = current.filter(id => id !== articleId);
    }

    all[pathSlug] = {
      completed: updated,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(PATH_STORAGE_KEY, JSON.stringify(all));
    notifyProgressChanged({ pathSlug, articleId, isCompleted });
  } catch (err) {
    console.warn('Could not save path progress:', err);
  }
}

export function toggleArticleCompletedInPath(pathSlug: string, articleId: string): boolean {
  const completed = isArticleCompletedInPath(pathSlug, articleId);
  setArticleCompletedInPath(pathSlug, articleId, !completed);
  return !completed;
}

export function resetPathProgress(pathSlug: string): void {
  if (typeof window === 'undefined') return;
  try {
    const all = getAllPathProgress();
    delete all[pathSlug];
    localStorage.setItem(PATH_STORAGE_KEY, JSON.stringify(all));
    notifyProgressChanged({ pathSlug, reset: true });
  } catch (err) {
    console.warn('Could not reset path progress:', err);
  }
}

// ── Quiz Scores API ──────────────────────────────────────────────────────────

export function getAllQuizScores(): AllQuizScores {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getQuizScore(articleSlug: string): QuizScoreRecord | null {
  const all = getAllQuizScores();
  return all[articleSlug] || null;
}

export function saveQuizScore(
  articleSlug: string,
  score: number,
  total: number,
  selectedAnswers?: number[]
): QuizScoreRecord {
  const passed = score >= Math.ceil(total * 0.65); // 2/3 or better
  const record: QuizScoreRecord = {
    score,
    total,
    passed,
    date: new Date().toISOString(),
    selectedAnswers,
  };

  if (typeof window !== 'undefined') {
    try {
      const all = getAllQuizScores();
      all[articleSlug] = record;
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(all));
      notifyProgressChanged({ articleSlug, quizScore: record });
    } catch (err) {
      console.warn('Could not save quiz score:', err);
    }
  }

  return record;
}

// ── Event Notifications ──────────────────────────────────────────────────────

function notifyProgressChanged(detail: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('synthreat:learning-updated', { detail }));
}
