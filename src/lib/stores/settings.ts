// Settings Store with Persistence
import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface AppSettings {
	soundEnabled: boolean;
	hapticEnabled: boolean;
	drawTime: number;
	guessTime: number;
	reducedMotion: boolean;
}

// ═══════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════

const defaultSettings: AppSettings = {
	soundEnabled: true,
	hapticEnabled: true,
	drawTime: 60,
	guessTime: 45,
	reducedMotion: false
};

const STORAGE_KEY = 'sketch-chain-settings';

// ═══════════════════════════════════════════════════════════
// PERSISTENCE
// ═══════════════════════════════════════════════════════════

function loadSettings(): AppSettings {
	if (!browser) return defaultSettings;

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return { ...defaultSettings, ...JSON.parse(stored) };
		}
	} catch (e) {
		console.warn('Failed to load settings:', e);
	}

	// Check for reduced motion preference
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	return { ...defaultSettings, reducedMotion: prefersReducedMotion };
}

function saveSettings(settings: AppSettings): void {
	if (!browser) return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	} catch (e) {
		console.warn('Failed to save settings:', e);
	}
}

// ═══════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════

function createSettingsStore() {
	const initial = loadSettings();
	const { subscribe, set, update } = writable<AppSettings>(initial);

	return {
		subscribe,

		// Update a single setting
		setSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
			update((settings) => {
				const updated = { ...settings, [key]: value };
				saveSettings(updated);
				return updated;
			});
		},

		// Toggle boolean settings
		toggle: (key: keyof AppSettings) => {
			update((settings) => {
				const current = settings[key];
				if (typeof current !== 'boolean') return settings;

				const updated = { ...settings, [key]: !current };
				saveSettings(updated);
				return updated;
			});
		},

		// Reset to defaults
		reset: () => {
			saveSettings(defaultSettings);
			set(defaultSettings);
		},

		// Get current value
		get: () => get({ subscribe })
	};
}

export const settingsStore = createSettingsStore();

// ═══════════════════════════════════════════════════════════
// QUICK ACCESS EXPORTS
// ═══════════════════════════════════════════════════════════

export const isSoundEnabled = () => get(settingsStore).soundEnabled;
export const isHapticEnabled = () => get(settingsStore).hapticEnabled;
