<script lang="ts">
	import { onMount } from 'svelte';
	import type { ChainStep } from '$lib/stores/game';
	import { playSound } from '$lib/stores/audio';
	import { celebrateBurst, celebrateCannons } from '$lib/utils/confetti';

	// This component is deprecated - kept for reference
	// The reveal page now uses inline step rendering
	export let steps: ChainStep[] = [];
	export let originalWord: string = '';
	export let onNext: () => void = () => {};

	let currentStep = 0;
	let isFlipping = false;

	$: step = steps[currentStep];
	$: isLastStep = currentStep === steps.length - 1;
	$: showMatch = isLastStep && checkMatch();

	function checkMatch(): boolean {
		const original = originalWord.toLowerCase().trim();
		const final = steps[steps.length - 1]?.content.toLowerCase().trim();
		return original === final;
	}

	function nextStep() {
		if (isFlipping) return;

		if (isLastStep) {
			onNext();
			return;
		}

		isFlipping = true;
		playSound('whoosh');

		setTimeout(() => {
			currentStep++;
			isFlipping = false;

			// Celebrate on reveal moments
			if (currentStep === steps.length - 1) {
				if (checkMatch()) {
					celebrateCannons();
					playSound('celebrate');
				} else {
					celebrateBurst();
					playSound('reveal');
				}
			} else {
				playSound('pop');
			}
		}, 400);
	}

	function getStepLabel(step: ChainStep): string {
		switch (step.type) {
			case 'word':
				return 'Original Word';
			case 'drawing':
				return `Player ${step.playerIndex + 1} drew`;
			case 'guess':
				return `Player ${step.playerIndex + 1} guessed`;
			default:
				return '';
		}
	}

	onMount(() => {
		playSound('reveal');
	});
</script>

<div class="reveal-container">
	<header class="reveal-header">
		<span class="label">Step {currentStep + 1} of {steps.length}</span>
	</header>

	<div class="reveal-card-wrapper">
		<div class="reveal-card" class:flipping={isFlipping}>
			<div class="card-content">
				<span class="step-label">{getStepLabel(step)}</span>

				{#if step.type === 'word' || step.type === 'guess'}
					<h2 class="step-content word-content">
						"{step.content}"
					</h2>
				{:else}
					<div class="step-content drawing-content">
						<p class="drawing-hint">📓 Check the sketchbook!</p>
						<p class="drawing-player">{step.content}</p>
					</div>
				{/if}
			</div>

			{#if showMatch}
				<div class="match-badge" class:success={showMatch}>🎉 Perfect Match!</div>
			{/if}
		</div>
	</div>

	<!-- Progress dots -->
	<div class="step-dots">
		{#each steps as _, i}
			<span class="dot" class:active={i === currentStep} class:completed={i < currentStep}></span>
		{/each}
	</div>

	<button class="btn btn-primary btn-lg btn-block" on:click={nextStep}>
		{isLastStep ? 'See Results →' : 'Flip Page →'}
	</button>
</div>

<style>
	.reveal-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-6);
		width: 100%;
		flex: 1;
	}

	.reveal-header {
		text-align: center;
	}

	.reveal-card-wrapper {
		perspective: 1200px;
		width: var(--card-max-width);
		max-width: 100%;
		container-type: inline-size;
	}

	.reveal-card {
		position: relative;
		width: 100%;
		aspect-ratio: var(--card-aspect-ratio);
		background: var(--bg-card);
		border-radius: var(--card-radius);
		padding: var(--space-6);
		border: 2px solid rgba(255, 255, 255, 0.1);
		box-shadow: var(--shadow-lg);
		transition: transform 0.4s var(--ease-out-expo);
		transform-style: preserve-3d;
		overflow: hidden;
	}

	.reveal-card.flipping {
		transform: rotateY(-90deg);
	}

	.card-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-4);
		text-align: center;
		height: 100%;
	}

	.step-label {
		font-family: var(--font-ui);
		font-size: var(--text-sm);
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-secondary);
	}

	.step-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.word-content {
		font-family: var(--font-display);
		font-size: clamp(var(--text-lg), 8cqw, var(--text-2xl));
		font-weight: 700;
		color: var(--accent-primary);
		text-transform: uppercase;
		max-width: 100%;
		overflow-wrap: break-word;
		word-break: break-word;
		hyphens: auto;
	}

	.drawing-content {
		gap: var(--space-2);
	}

	.drawing-hint {
		font-size: clamp(2rem, 12cqw, 3rem);
	}

	.drawing-player {
		font-size: var(--text-base);
		color: var(--text-secondary);
	}

	.match-badge {
		position: absolute;
		top: -12px;
		right: -12px;
		background: var(--success);
		color: var(--text-inverse);
		font-family: var(--font-display);
		font-size: var(--text-sm);
		font-weight: 600;
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-full);
		transform: rotate(12deg);
		box-shadow: 0 4px 12px rgba(46, 196, 182, 0.4);
		animation: bounce-in 0.5s var(--ease-out-back);
	}

	.step-dots {
		display: flex;
		gap: var(--space-2);
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--bg-elevated);
		transition:
			background-color var(--duration-fast) var(--ease-out-expo),
			transform var(--duration-fast) var(--ease-out-expo);
	}

	.dot.active {
		background: var(--accent-primary);
		transform: scale(1.3);
	}

	.dot.completed {
		background: var(--accent-secondary);
	}
</style>
