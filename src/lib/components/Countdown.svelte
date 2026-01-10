<script lang="ts">
	import { onMount } from 'svelte';
	import { playSound } from '$lib/stores/audio';

	export let count: number = 3;
	export let onComplete: () => void;

	let current = count;
	let animating = false;

	onMount(() => {
		const interval = setInterval(() => {
			playSound('countdown');
			animating = true;

			setTimeout(() => {
				animating = false;
				current--;

				if (current === 0) {
					clearInterval(interval);
					setTimeout(() => {
						playSound('whoosh');
						onComplete();
					}, 300);
				}
			}, 500);
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="countdown-container">
	<div class="countdown-number" class:animating>
		{current > 0 ? current : 'GO!'}
	</div>
</div>

<style>
	.countdown-container {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
	}

	.countdown-number {
		font-family: var(--font-display);
		font-size: 8rem;
		font-weight: 700;
		color: var(--accent-primary);
		text-shadow: 0 0 60px var(--accent-glow);
		animation: countdown-pulse 0.5s var(--ease-out-back);
	}

	.countdown-number.animating {
		animation: countdown-exit 0.3s var(--ease-out-expo) forwards;
	}

	@keyframes countdown-exit {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}
</style>
