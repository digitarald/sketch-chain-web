// Audio Store & Sound Effects
import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { settingsStore } from './settings';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type SoundName =
	| 'tick'
	| 'tick-urgent'
	| 'reveal'
	| 'success'
	| 'times-up'
	| 'whoosh'
	| 'pop'
	| 'countdown'
	| 'celebrate';

interface AudioState {
	loaded: boolean;
	muted: boolean;
}

// ═══════════════════════════════════════════════════════════
// SOUND DEFINITIONS
// ═══════════════════════════════════════════════════════════

// We'll use Web Audio API for low-latency, synthesized sounds
// This avoids needing actual audio files for MVP

class SoundSynthesizer {
	private context: AudioContext | null = null;
	private gainNode: GainNode | null = null;

	private getContext(): AudioContext {
		if (!this.context) {
			this.context = new AudioContext();
			this.gainNode = this.context.createGain();
			this.gainNode.connect(this.context.destination);
			this.gainNode.gain.value = 0.3; // Master volume
		}
		return this.context;
	}

	private playTone(
		frequency: number,
		duration: number,
		type: OscillatorType = 'sine',
		attack = 0.01,
		decay = 0.1
	) {
		const ctx = this.getContext();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = type;
		osc.frequency.value = frequency;
		osc.connect(gain);
		gain.connect(this.gainNode!);

		const now = ctx.currentTime;
		gain.gain.setValueAtTime(0, now);
		gain.gain.linearRampToValueAtTime(0.5, now + attack);
		gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

		osc.start(now);
		osc.stop(now + duration);
	}

	tick() {
		this.playTone(800, 0.05, 'sine');
	}

	tickUrgent() {
		this.playTone(600, 0.08, 'square');
		setTimeout(() => this.playTone(800, 0.08, 'square'), 50);
	}

	countdown() {
		this.playTone(440, 0.15, 'sine');
	}

	reveal() {
		this.playTone(523, 0.1, 'sine');
		setTimeout(() => this.playTone(659, 0.1, 'sine'), 100);
		setTimeout(() => this.playTone(784, 0.2, 'sine'), 200);
	}

	success() {
		this.playTone(523, 0.1, 'sine');
		setTimeout(() => this.playTone(659, 0.1, 'sine'), 80);
		setTimeout(() => this.playTone(784, 0.1, 'sine'), 160);
		setTimeout(() => this.playTone(1047, 0.3, 'sine'), 240);
	}

	timesUp() {
		this.playTone(200, 0.3, 'sawtooth');
		setTimeout(() => this.playTone(150, 0.4, 'sawtooth'), 150);
	}

	whoosh() {
		const ctx = this.getContext();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		const filter = ctx.createBiquadFilter();

		filter.type = 'lowpass';
		filter.frequency.value = 1000;

		osc.type = 'sawtooth';
		osc.frequency.setValueAtTime(100, ctx.currentTime);
		osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.15);

		osc.connect(filter);
		filter.connect(gain);
		gain.connect(this.gainNode!);

		gain.gain.setValueAtTime(0.3, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

		osc.start();
		osc.stop(ctx.currentTime + 0.2);
	}

	pop() {
		this.playTone(600, 0.08, 'sine');
	}

	celebrate() {
		// Arpeggio celebration
		const notes = [523, 659, 784, 1047, 784, 659, 523];
		notes.forEach((freq, i) => {
			setTimeout(() => this.playTone(freq, 0.12, 'sine'), i * 60);
		});
	}

	resume() {
		if (this.context?.state === 'suspended') {
			this.context.resume();
		}
	}
}

// ═══════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════

const synthesizer = browser ? new SoundSynthesizer() : null;

function createAudioStore() {
	const { subscribe, update } = writable<AudioState>({
		loaded: false,
		muted: false
	});

	return {
		subscribe,

		// Initialize audio context (call on user interaction)
		init: () => {
			synthesizer?.resume();
			update((state) => ({ ...state, loaded: true }));
		},

		// Play a sound effect
		play: (sound: SoundName) => {
			if (!browser || !synthesizer) return;

			const settings = get(settingsStore);
			if (!settings.soundEnabled) return;

			synthesizer.resume();

			switch (sound) {
				case 'tick':
					synthesizer.tick();
					break;
				case 'tick-urgent':
					synthesizer.tickUrgent();
					break;
				case 'countdown':
					synthesizer.countdown();
					break;
				case 'reveal':
					synthesizer.reveal();
					break;
				case 'success':
					synthesizer.success();
					break;
				case 'times-up':
					synthesizer.timesUp();
					break;
				case 'whoosh':
					synthesizer.whoosh();
					break;
				case 'pop':
					synthesizer.pop();
					break;
				case 'celebrate':
					synthesizer.celebrate();
					break;
			}
		},

		// Toggle mute
		toggleMute: () => {
			settingsStore.toggle('soundEnabled');
		}
	};
}

export const audioStore = createAudioStore();

// Convenience function
export const playSound = (sound: SoundName) => audioStore.play(sound);
