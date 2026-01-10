// Haptic Feedback Utilities
import { browser } from '$app/environment';
import { settingsStore } from '$lib/stores/settings';
import { get } from 'svelte/store';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type HapticIntensity = 'light' | 'medium' | 'heavy';

// Vibration patterns in milliseconds
const PATTERNS: Record<HapticIntensity, number | number[]> = {
	light: 10,
	medium: 25,
	heavy: [50, 30, 100]
};

// ═══════════════════════════════════════════════════════════
// HAPTIC FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Check if vibration API is available
 */
export function supportsHaptic(): boolean {
	return browser && 'vibrate' in navigator;
}

/**
 * Trigger haptic feedback
 */
export function triggerHaptic(intensity: HapticIntensity = 'medium'): void {
	if (!browser) return;

	const settings = get(settingsStore);
	if (!settings.hapticEnabled) return;

	if (!supportsHaptic()) return;

	try {
		const pattern = PATTERNS[intensity];
		navigator.vibrate(pattern);
	} catch (e) {
		// Silently fail - haptics are enhancement only
	}
}

/**
 * Stop any ongoing vibration
 */
export function stopHaptic(): void {
	if (!browser || !supportsHaptic()) return;

	try {
		navigator.vibrate(0);
	} catch (e) {
		// Silently fail
	}
}

/**
 * Play a success haptic pattern
 */
export function hapticSuccess(): void {
	if (!browser || !supportsHaptic()) return;

	const settings = get(settingsStore);
	if (!settings.hapticEnabled) return;

	try {
		// Double tap pattern
		navigator.vibrate([30, 50, 30]);
	} catch (e) {
		// Silently fail
	}
}

/**
 * Play an error/alert haptic pattern
 */
export function hapticError(): void {
	if (!browser || !supportsHaptic()) return;

	const settings = get(settingsStore);
	if (!settings.hapticEnabled) return;

	try {
		// Strong buzz pattern
		navigator.vibrate([100, 30, 100, 30, 100]);
	} catch (e) {
		// Silently fail
	}
}

/**
 * Play countdown tick haptic
 */
export function hapticTick(): void {
	triggerHaptic('light');
}
