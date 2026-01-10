// Timer Store with Urgency States
import { writable, derived, get } from 'svelte/store';
import { triggerHaptic } from '$lib/utils/haptics';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type UrgencyLevel = 'normal' | 'warning' | 'critical';

export interface TimerState {
	duration: number;
	timeLeft: number;
	isRunning: boolean;
	isPaused: boolean;
}

// ═══════════════════════════════════════════════════════════
// THRESHOLDS
// ═══════════════════════════════════════════════════════════

const WARNING_THRESHOLD = 15; // seconds
const CRITICAL_THRESHOLD = 5; // seconds

// ═══════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════

function createTimerStore() {
	const { subscribe, set, update } = writable<TimerState>({
		duration: 60,
		timeLeft: 60,
		isRunning: false,
		isPaused: false
	});

	let interval: ReturnType<typeof setInterval> | null = null;
	let onCompleteCallback: (() => void) | null = null;
	let lastTickTime = 0;

	const clearTimer = () => {
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
	};

	const tick = () => {
		update((state) => {
			if (!state.isRunning || state.isPaused) return state;

			const newTimeLeft = state.timeLeft - 1;

			// Haptic feedback at thresholds
			if (newTimeLeft === WARNING_THRESHOLD) {
				triggerHaptic('light');
			} else if (newTimeLeft <= CRITICAL_THRESHOLD && newTimeLeft > 0) {
				triggerHaptic('medium');
			}

			// Timer complete
			if (newTimeLeft <= 0) {
				clearTimer();
				triggerHaptic('heavy');

				// Call completion callback on next tick
				if (onCompleteCallback) {
					setTimeout(onCompleteCallback, 0);
				}

				return {
					...state,
					timeLeft: 0,
					isRunning: false
				};
			}

			return { ...state, timeLeft: newTimeLeft };
		});
	};

	return {
		subscribe,

		// Initialize timer with duration
		init: (duration: number) => {
			clearTimer();
			set({
				duration,
				timeLeft: duration,
				isRunning: false,
				isPaused: false
			});
		},

		// Start the timer
		start: (onComplete?: () => void) => {
			onCompleteCallback = onComplete || null;
			lastTickTime = Date.now();

			update((state) => ({ ...state, isRunning: true, isPaused: false }));

			// Use setInterval for consistent ticks
			interval = setInterval(tick, 1000);
		},

		// Pause the timer
		pause: () => {
			update((state) => ({ ...state, isPaused: true }));
		},

		// Resume from pause
		resume: () => {
			update((state) => ({ ...state, isPaused: false }));
		},

		// Stop and reset
		stop: () => {
			clearTimer();
			update((state) => ({
				...state,
				timeLeft: state.duration,
				isRunning: false,
				isPaused: false
			}));
		},

		// Force complete (skip remaining time)
		complete: () => {
			clearTimer();
			update((state) => ({
				...state,
				timeLeft: 0,
				isRunning: false
			}));
			if (onCompleteCallback) {
				onCompleteCallback();
			}
		},

		// Get current state snapshot
		getState: (): TimerState => get({ subscribe })
	};
}

export const timerStore = createTimerStore();

// ═══════════════════════════════════════════════════════════
// DERIVED STORES
// ═══════════════════════════════════════════════════════════

// Progress from 0 to 1 (1 = full, 0 = empty)
export const progress = derived(timerStore, ($timer) => {
	if ($timer.duration === 0) return 1;
	return $timer.timeLeft / $timer.duration;
});

// Urgency level based on time remaining
export const urgency = derived(timerStore, ($timer) => {
	if ($timer.timeLeft <= CRITICAL_THRESHOLD) return 'critical' as UrgencyLevel;
	if ($timer.timeLeft <= WARNING_THRESHOLD) return 'warning' as UrgencyLevel;
	return 'normal' as UrgencyLevel;
});

// Formatted time string (MM:SS or just seconds if under 1 min)
export const formattedTime = derived(timerStore, ($timer) => {
	const seconds = Math.max(0, $timer.timeLeft);
	if (seconds >= 60) {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
	return seconds.toString();
});

// Boolean for UI effects
export const isRunning = derived(timerStore, ($timer) => $timer.isRunning && !$timer.isPaused);
export const isComplete = derived(timerStore, ($timer) => $timer.timeLeft === 0);
