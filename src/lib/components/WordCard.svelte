<script lang="ts">
	import { onMount } from 'svelte';
	import { playSound } from '$lib/stores/audio';

	export let word: string;
	export let playerNumber: number;
	export let onReady: () => void;

	let revealed = false;
	let mounted = false;

	onMount(() => {
		mounted = true;
		// Delay reveal for dramatic effect
		setTimeout(() => {
			revealed = true;
			playSound('reveal');
		}, 600);
	});
</script>

<div class="word-card-container">
	<p class="label">Player {playerNumber}'s Turn</p>

	<div class="card-wrapper">
		<div class="card" class:revealed>
			<!-- Card back -->
			<div class="card-face card-back">
				<div class="card-pattern">
					<span>?</span>
				</div>
			</div>

			<!-- Card front -->
			<div class="card-face card-front">
				<span class="label">Your word is</span>
				<h1 class="word">{word}</h1>
			</div>
		</div>
	</div>

	{#if revealed}
		<p class="hint slide-up">Don't show anyone else!</p>

		<button class="btn btn-primary btn-lg btn-block slide-up stagger-2" on:click={onReady}>
			Got it! Start Drawing
		</button>
	{/if}
</div>

<style>
	.word-card-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-6);
		width: 100%;
	}

	.card-wrapper {
		perspective: 1000px;
		width: var(--card-max-width);
		max-width: 100%;
		container-type: inline-size;
	}

	.card {
		position: relative;
		width: 100%;
		aspect-ratio: var(--card-aspect-ratio);
		transform-style: preserve-3d;
		transition: transform 0.8s var(--ease-out-expo);
	}

	.card.revealed {
		transform: rotateY(180deg);
	}

	.card-face {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		backface-visibility: hidden;
		border-radius: var(--card-radius);
		padding: var(--space-6);
		border: 3px solid rgba(255, 255, 255, 0.1);
		overflow: hidden;
	}

	.card-back {
		background: linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-secondary) 100%);
	}

	.card-pattern {
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-display);
		font-size: 6rem;
		color: var(--accent-primary);
		opacity: 0.3;
		animation: float 3s ease-in-out infinite;
	}

	.card-front {
		background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%);
		transform: rotateY(180deg);
		text-align: center;
		gap: var(--space-4);
		box-shadow: var(--shadow-glow);
	}

	.word {
		font-family: var(--font-display);
		font-size: clamp(var(--text-2xl), 15cqw, var(--text-4xl));
		font-weight: 700;
		color: var(--accent-primary);
		text-transform: uppercase;
		letter-spacing: 0.02em;
		text-shadow: 0 0 30px var(--accent-glow);
		animation: text-glow-pulse 2s ease-in-out infinite;
		max-width: 100%;
		overflow-wrap: break-word;
		word-break: break-word;
		hyphens: auto;
	}

	@keyframes text-glow-pulse {
		0%, 100% {
			text-shadow: 0 0 20px var(--accent-glow);
		}
		50% {
			text-shadow: 0 0 40px var(--accent-glow), 0 0 60px var(--accent-glow);
		}
	}

	.hint {
		color: var(--text-secondary);
		font-size: var(--text-lg);
		text-align: center;
	}
</style>
