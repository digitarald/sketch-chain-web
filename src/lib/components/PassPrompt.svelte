<script lang="ts">
	import { playSound } from '$lib/stores/audio';
	import { triggerHaptic } from '$lib/utils/haptics';

	export let direction: 'left' | 'right' = 'left';
	export let instruction: string = 'Pass your sketchbook';
	export let onReady: () => void;

	function handleReady() {
		playSound('whoosh');
		triggerHaptic('medium');
		onReady();
	}
</script>

<div class="pass-container">
	<div class="pass-icon" class:left={direction === 'left'} class:right={direction === 'right'}>
		<span class="arrow pass-arrow">←</span>
		<span class="book">📓</span>
	</div>

	<h2 class="pass-title">
		{direction === 'left' ? '← Pass Left ←' : '→ Pass Right →'}
	</h2>

	<p class="pass-instruction">
		{instruction}
	</p>

	<p class="pass-hint">
		Hand your sketchbook to the player on your {direction.toUpperCase()}
	</p>

	<button class="btn btn-primary btn-lg btn-block" on:click={handleReady}>
		Ready for Next Round
	</button>
</div>

<style>
	.pass-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-6);
		text-align: center;
		padding: var(--space-8) var(--space-4);
	}

	.pass-icon {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		font-size: 4rem;
	}

	.pass-icon.right {
		flex-direction: row-reverse;
	}

	.pass-icon.right .arrow {
		transform: scaleX(-1);
	}

	.arrow {
		color: var(--accent-primary);
		text-shadow: 0 0 20px var(--accent-glow);
	}

	.book {
		animation: float 2s ease-in-out infinite;
	}

	.pass-title {
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--accent-primary);
		letter-spacing: 0.02em;
	}

	.pass-instruction {
		font-size: var(--text-lg);
		color: var(--text-primary);
		max-width: 280px;
	}

	.pass-hint {
		font-size: var(--text-base);
		color: var(--text-secondary);
	}
</style>
