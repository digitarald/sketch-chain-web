// Confetti Celebration Utilities
import { browser } from '$app/environment';

// ═══════════════════════════════════════════════════════════
// CONFETTI WRAPPER
// ═══════════════════════════════════════════════════════════

let confetti: typeof import('canvas-confetti').default | null = null;

async function getConfetti() {
	if (!browser) return null;

	if (!confetti) {
		const module = await import('canvas-confetti');
		confetti = module.default;
	}

	return confetti;
}

// ═══════════════════════════════════════════════════════════
// CELEBRATION EFFECTS
// ═══════════════════════════════════════════════════════════

/**
 * Fire a burst of confetti from the center
 */
export async function celebrateBurst(): Promise<void> {
	const confetti = await getConfetti();
	if (!confetti) return;

	confetti({
		particleCount: 100,
		spread: 70,
		origin: { y: 0.6 },
		colors: ['#ff6b35', '#f7c59f', '#2ec4b6', '#ffbe0b', '#ff006e']
	});
}

/**
 * Fire confetti cannons from both sides
 */
export async function celebrateCannons(): Promise<void> {
	const confetti = await getConfetti();
	if (!confetti) return;

	const count = 200;
	const defaults = {
		origin: { y: 0.7 },
		colors: ['#ff6b35', '#f7c59f', '#2ec4b6', '#ffbe0b', '#ff006e']
	};

	function fire(particleRatio: number, opts: object) {
		confetti({
			...defaults,
			particleCount: Math.floor(count * particleRatio),
			...opts
		});
	}

	fire(0.25, { spread: 26, startVelocity: 55 });
	fire(0.2, { spread: 60 });
	fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
	fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
	fire(0.1, { spread: 120, startVelocity: 45 });
}

/**
 * Continuous confetti rain for a duration
 */
export async function celebrateRain(duration = 3000): Promise<void> {
	const confetti = await getConfetti();
	if (!confetti) return;

	const animationEnd = Date.now() + duration;
	const colors = ['#ff6b35', '#f7c59f', '#2ec4b6', '#ffbe0b'];

	(function frame() {
		confetti({
			particleCount: 2,
			angle: 60,
			spread: 55,
			origin: { x: 0 },
			colors
		});
		confetti({
			particleCount: 2,
			angle: 120,
			spread: 55,
			origin: { x: 1 },
			colors
		});

		if (Date.now() < animationEnd) {
			requestAnimationFrame(frame);
		}
	})();
}

/**
 * Fireworks effect
 */
export async function celebrateFireworks(): Promise<void> {
	const confetti = await getConfetti();
	if (!confetti) return;

	const duration = 2000;
	const animationEnd = Date.now() + duration;
	const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

	function randomInRange(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}

	const interval = setInterval(() => {
		const timeLeft = animationEnd - Date.now();

		if (timeLeft <= 0) {
			return clearInterval(interval);
		}

		const particleCount = 50 * (timeLeft / duration);

		confetti({
			...defaults,
			particleCount,
			origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
			colors: ['#ff6b35', '#2ec4b6']
		});
		confetti({
			...defaults,
			particleCount,
			origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
			colors: ['#ffbe0b', '#ff006e']
		});
	}, 250);
}

/**
 * Simple pop for smaller celebrations
 */
export async function celebratePop(x = 0.5, y = 0.5): Promise<void> {
	const confetti = await getConfetti();
	if (!confetti) return;

	confetti({
		particleCount: 30,
		spread: 60,
		origin: { x, y },
		colors: ['#ff6b35', '#f7c59f', '#2ec4b6'],
		scalar: 0.8
	});
}
