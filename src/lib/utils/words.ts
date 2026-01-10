// Word Picker Utilities
import type { Difficulty } from '$lib/stores/game';

// Import word data (will be JSON files)
import wordsEasy from '$lib/data/words-easy.json';
import wordsMedium from '$lib/data/words-medium.json';
import wordsHard from '$lib/data/words-hard.json';
import wordsChaotic from '$lib/data/words-chaotic.json';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface WordEntry {
	word: string;
	category: string;
}

// ═══════════════════════════════════════════════════════════
// WORD POOLS
// ═══════════════════════════════════════════════════════════

const wordPools: Record<Difficulty, WordEntry[]> = {
	easy: wordsEasy,
	medium: wordsMedium,
	hard: wordsHard,
	chaotic: wordsChaotic
};

// ═══════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
	const result = [...array];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

/**
 * Pick a single random word for the given difficulty
 */
export function pickWord(difficulty: Difficulty): string {
	const pool = wordPools[difficulty];
	const entry = pool[Math.floor(Math.random() * pool.length)];
	return entry.word;
}

/**
 * Pick multiple unique words for a game session
 */
export function pickWords(difficulty: Difficulty, count: number): string[] {
	const pool = wordPools[difficulty];

	// If we need more words than available, allow repeats with shuffling
	if (count > pool.length) {
		const repeated = [];
		while (repeated.length < count) {
			repeated.push(...shuffle(pool.map((e) => e.word)));
		}
		return repeated.slice(0, count);
	}

	// Otherwise pick unique words
	const shuffled = shuffle(pool);
	return shuffled.slice(0, count).map((e) => e.word);
}

/**
 * Get words filtered by category
 */
export function pickWordsByCategory(
	difficulty: Difficulty,
	category: string,
	count: number
): string[] {
	const pool = wordPools[difficulty].filter((e) => e.category === category);

	if (pool.length === 0) {
		// Fallback to any category
		return pickWords(difficulty, count);
	}

	const shuffled = shuffle(pool);

	// If not enough in category, pad with others
	if (shuffled.length < count) {
		const remaining = pickWords(difficulty, count - shuffled.length);
		return [...shuffled.map((e) => e.word), ...remaining];
	}

	return shuffled.slice(0, count).map((e) => e.word);
}

/**
 * Get all available categories for a difficulty
 */
export function getCategories(difficulty: Difficulty): string[] {
	const pool = wordPools[difficulty];
	return [...new Set(pool.map((e) => e.category))];
}

/**
 * Get word count for a difficulty
 */
export function getWordCount(difficulty: Difficulty): number {
	return wordPools[difficulty].length;
}
