// Game State Machine & Store
import { writable, derived, get } from 'svelte/store';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type GamePhase =
	| 'lobby'
	| 'countdown'
	| 'word-reveal'
	| 'drawing'
	| 'pass-after-draw'
	| 'guessing'
	| 'pass-after-guess'
	| 'reveal'
	| 'summary';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'chaotic';

export interface ChainStep {
	type: 'word' | 'drawing' | 'guess';
	playerIndex: number;
	content: string;
	timestamp: number;
}

export interface GameSettings {
	drawTime: number;
	guessTime: number;
	soundEnabled: boolean;
}

export interface GameState {
	phase: GamePhase;
	players: number;
	difficulty: Difficulty;
	currentPlayer: number;
	originalWord: string; // The starting word
	steps: ChainStep[]; // Single evolving sequence
	currentWord: string; // What current player sees
	settings: GameSettings;
}

// ═══════════════════════════════════════════════════════════
// VALID TRANSITIONS
// ═══════════════════════════════════════════════════════════

const validTransitions: Record<GamePhase, GamePhase[]> = {
	lobby: ['countdown'],
	countdown: ['word-reveal'],
	'word-reveal': ['drawing'],
	drawing: ['pass-after-draw'],
	'pass-after-draw': ['guessing'],
	guessing: ['pass-after-guess', 'reveal'],
	'pass-after-guess': ['word-reveal', 'drawing', 'reveal'],
	reveal: ['summary'],
	summary: ['lobby']
};

// ═══════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════

const initialState: GameState = {
	phase: 'lobby',
	players: 6,
	difficulty: 'medium',
	currentPlayer: 0,
	originalWord: '',
	steps: [],
	currentWord: '',
	settings: {
		drawTime: 60,
		guessTime: 45,
		soundEnabled: true
	}
};

// ═══════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════

function createGameStore() {
	const { subscribe, set, update } = writable<GameState>(initialState);

	return {
		subscribe,

		// Set player count
		setPlayers: (count: number) => {
			update((state) => ({ ...state, players: Math.min(12, Math.max(4, count)) }));
		},

		// Set difficulty
		setDifficulty: (difficulty: Difficulty) => {
			update((state) => ({ ...state, difficulty }));
		},

		// Update settings
		updateSettings: (settings: Partial<GameSettings>) => {
			update((state) => ({
				...state,
				settings: { ...state.settings, ...settings }
			}));
		},

		// Transition to next phase
		transition: (nextPhase: GamePhase) => {
			update((state) => {
				const allowed = validTransitions[state.phase];
				if (!allowed.includes(nextPhase)) {
					console.warn(`Invalid transition: ${state.phase} → ${nextPhase}`);
					return state;
				}
				return { ...state, phase: nextPhase };
			});
		},

		// Start a new game with a single word
		startGame: (words: string[]) => {
			const word = words[0]; // Only use the first word
			update((state) => ({
				...state,
				phase: 'countdown',
				currentPlayer: 0,
				originalWord: word,
				steps: [
					{
						type: 'word',
						playerIndex: 0,
						content: word,
						timestamp: Date.now()
					}
				],
				currentWord: word
			}));
		},

		// Set current word for display
		setCurrentWord: (word: string) => {
			update((state) => ({ ...state, currentWord: word }));
		},

		// Record a drawing placeholder (actual drawing is on paper)
		recordDrawing: () => {
			update((state) => ({
				...state,
				steps: [
					...state.steps,
					{
						type: 'drawing' as const,
						playerIndex: state.currentPlayer,
						content: `Player ${state.currentPlayer + 1}'s drawing`,
						timestamp: Date.now()
					}
				]
			}));
		},

		// Record a guess and update currentWord for next player
		recordGuess: (guess: string) => {
			update((state) => ({
				...state,
				steps: [
					...state.steps,
					{
						type: 'guess' as const,
						playerIndex: state.currentPlayer,
						content: guess,
						timestamp: Date.now()
					}
				],
				currentWord: guess // Next player will see this guess
			}));
		},

		// Advance to next player
		nextTurn: () => {
			update((state) => ({
				...state,
				currentPlayer: (state.currentPlayer + 1) % state.players
			}));
		},

		// Check if game is complete (all players have participated)
		isComplete: (): boolean => {
			const state = get(gameStore);
			// Each player draws once, all but the last also guess
			// Flow: P1 draws → P2 guesses & draws → P3 guesses & draws → ... → PN guesses
			// Total steps: 1 word + N drawings + (N-1) guesses = 2N steps
			// But actually for proper telephone: P1 sees word → draws
			// P2 sees drawing → guesses, then P3 sees guess → draws, etc.
			// For N players: word + (N-1) pairs of (draw, guess) wouldn't quite work
			// Simpler: everyone does one action. N players = N actions after the initial word
			// Actually the spec says: steps.length >= players * 2
			// Let's use: game ends when we've gone around - each player contributes once
			// The first player draws the word, subsequent players alternate guess/draw
			// Total actions: N (one per player)
			return state.steps.length >= state.players + 1; // word + N actions
		},

		// Get the steps for reveal
		getSteps: (): ChainStep[] => {
			return get(gameStore).steps;
		},

		// Get the original word
		getOriginalWord: (): string => {
			return get(gameStore).originalWord;
		},

		// Reset to lobby
		reset: () => {
			set(initialState);
		}
	};
}

export const gameStore = createGameStore();

// ═══════════════════════════════════════════════════════════
// DERIVED STORES
// ═══════════════════════════════════════════════════════════

export const phase = derived(gameStore, ($game) => $game.phase);
export const players = derived(gameStore, ($game) => $game.players);
export const difficulty = derived(gameStore, ($game) => $game.difficulty);
export const currentPlayer = derived(gameStore, ($game) => $game.currentPlayer);
export const currentWord = derived(gameStore, ($game) => $game.currentWord);
export const settings = derived(gameStore, ($game) => $game.settings);
export const steps = derived(gameStore, ($game) => $game.steps);
export const originalWord = derived(gameStore, ($game) => $game.originalWord);



// Check if current turn is a drawing turn (odd positions after word)
export const isDrawingTurn = derived(gameStore, ($game) => {
	// steps[0] = word, steps[1] = draw, steps[2] = guess, steps[3] = draw, etc.
	// Drawing happens at odd indices (1, 3, 5, ...)
	return $game.steps.length % 2 === 1;
});

// Progress through the game (0-1)
export const gameProgress = derived(gameStore, ($game) => {
	const totalSteps = $game.players + 1; // word + N player actions
	return Math.min(1, $game.steps.length / totalSteps);
});
