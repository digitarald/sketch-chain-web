<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { gameStore, phase, steps, originalWord } from '$lib/stores/game';
	import { playSound } from '$lib/stores/audio';
	import { celebrateCannons, celebrateBurst } from '$lib/utils/confetti';

	let currentStepIndex = 0;
	let showSummary = false;
	let isFlipping = false;

	// Redirect if not in reveal phase or empty steps
	onMount(() => {
		if ($phase !== 'reveal' || $steps.length === 0) {
			goto('/');
		}
	});

	function checkMatch(): boolean {
		const original = $originalWord.toLowerCase().trim();
		const finalStep = $steps[$steps.length - 1];
		const final = finalStep?.content.toLowerCase().trim() ?? '';
		return original === final;
	}

	function handleNextStep() {
		if (isFlipping) return;

		if (currentStepIndex < $steps.length - 1) {
			// Flip animation: flip out, change content, flip in
			isFlipping = true;
			playSound('pop');

			setTimeout(() => {
				currentStepIndex++;
				// Check if this is the last step
				if (currentStepIndex === $steps.length - 1) {
					if (checkMatch()) {
						celebrateCannons();
						playSound('celebrate');
					} else {
						celebrateBurst();
						playSound('reveal');
					}
				}
				setTimeout(() => {
					isFlipping = false;
				}, 200);
			}, 200);
		} else {
			// All steps revealed, show summary
			showSummary = true;
		}
	}

	function playAgain() {
		gameStore.reset();
		goto('/');
	}

	function getGameResult(): string {
		if (checkMatch()) {
			return '🎯 Perfect Match!';
		} else {
			const finalStep = $steps[$steps.length - 1];
			return `${$originalWord} → ${finalStep?.content ?? '???'}`;
		}
	}

	$: currentStep = $steps[currentStepIndex];
	$: isLastStep = currentStepIndex === $steps.length - 1;
	$: showMatch = isLastStep && checkMatch();
</script>

<svelte:head>
	<title>Reveal - Sketch Chain</title>
</svelte:head>

<div class="screen reveal">
	{#if !showSummary}
		<!-- Reveal slideshow -->
		{#if currentStep}
			<div class="reveal-content">
				<header class="reveal-header">
					<div class="step-dots">
						{#each $steps as _, i}
							<span
								class="dot"
								class:active={i === currentStepIndex}
								class:completed={i < currentStepIndex}
							></span>
						{/each}
					</div>
				</header>

				<div class="card-wrapper">
					<div class="step-card" class:flipping={isFlipping}>
						{#if showMatch}
							<span class="match-badge">🎉 Perfect Match!</span>
						{/if}

						{#if currentStep.type === 'word'}
							<div class="step-type">Original Word</div>
							<div class="step-content word">{currentStep.content}</div>
							<div class="step-player">Starting word</div>
						{:else if currentStep.type === 'drawing'}
							<div class="step-type">Drawing</div>
							<div class="step-content drawing">🎨</div>
							<div class="step-player">Player {currentStep.playerIndex + 1} drew</div>
							<p class="step-hint">Look at the sketchbook!</p>
						{:else if currentStep.type === 'guess'}
							<div class="step-type">Guess</div>
							<div class="step-content guess">"{currentStep.content}"</div>
							<div class="step-player">Player {currentStep.playerIndex + 1} guessed</div>
						{/if}
					</div>
				</div>

				<button class="btn btn-primary btn-lg btn-block" on:click={handleNextStep}>
					{currentStepIndex < $steps.length - 1 ? 'Next →' : 'See Results'}
				</button>
			</div>
		{/if}
	{:else}
		<!-- Summary screen -->
		<div class="summary">
			<header class="summary-header">
				<h1 class="summary-title">🎉 Game Complete!</h1>
			</header>

			<main class="summary-content">
				<div class="result-section">
					<h3 class="section-title">The Journey</h3>
					<div class="result-card">
						<span class="result-text">{getGameResult()}</span>
					</div>
				</div>

				<div class="stats-section">
					<h3 class="section-title">Stats</h3>
					<div class="stats-grid">
						<div class="stat">
							<span class="stat-value">{$steps.length}</span>
							<span class="stat-label">Steps</span>
						</div>
						<div class="stat">
							<span class="stat-value">
								{$steps.filter((s) => s.type === 'guess').length}
							</span>
							<span class="stat-label">Guesses</span>
						</div>
					</div>
				</div>
			</main>

			<footer class="summary-footer">
				<button class="btn btn-primary btn-lg btn-block" on:click={playAgain}> Play Again </button>
			</footer>
		</div>
	{/if}
</div>

<style>
	.reveal {
		min-height: 100dvh;
		padding: var(--space-4);
		padding-top: calc(var(--safe-area-inset-top) + var(--space-4));
		padding-bottom: calc(var(--safe-area-inset-bottom) + var(--space-4));
		display: flex;
		flex-direction: column;
		max-width: var(--max-width);
		margin: 0 auto;
	}

	.reveal-content {
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: var(--space-6);
	}

	.reveal-header {
		display: flex;
		justify-content: center;
		padding: var(--space-4) 0;
	}

	/* Progress dots */
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
			background-color 0.2s ease-out,
			transform 0.2s ease-out;
	}

	.dot.active {
		background: var(--accent-primary);
		transform: scale(1.3);
	}

	.dot.completed {
		background: var(--accent-secondary);
	}

	/* Card wrapper with 3D perspective */
	.card-wrapper {
		flex: 1;
		perspective: 1200px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.step-card {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-4);
		padding: var(--space-8);
		background: var(--bg-card);
		border-radius: var(--radius-lg);
		text-align: center;
		min-height: 300px;
		border: 2px solid rgba(255, 255, 255, 0.1);
		box-shadow: var(--shadow-lg);
		transition: transform 0.2s ease-out;
		transform-style: preserve-3d;
	}

	.step-card.flipping {
		transform: rotateY(-90deg);
	}

	/* Match badge */
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
		animation: bounce-in 0.5s ease-out;
	}

	@keyframes bounce-in {
		0% {
			transform: rotate(12deg) scale(0);
			opacity: 0;
		}
		60% {
			transform: rotate(12deg) scale(1.2);
			opacity: 1;
		}
		100% {
			transform: rotate(12deg) scale(1);
			opacity: 1;
		}
	}

	.step-type {
		font-family: var(--font-ui);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.step-content {
		font-family: var(--font-display);
		font-weight: 700;
	}

	.step-content.word {
		font-size: var(--text-3xl);
		color: var(--accent-primary);
		text-transform: uppercase;
	}

	.step-content.drawing {
		font-size: 4rem;
	}

	.step-content.guess {
		font-size: var(--text-2xl);
		color: var(--text-primary);
	}

	.step-player {
		font-size: var(--text-base);
		color: var(--text-secondary);
	}

	.step-hint {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		font-style: italic;
	}

	.summary {
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: var(--space-6);
	}

	.summary-header {
		text-align: center;
		padding: var(--space-4) 0;
	}

	.summary-title {
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--text-primary);
		animation: celebrate-pop 0.6s var(--ease-out-back);
	}

	.summary-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
	}

	.section-title {
		font-family: var(--font-display);
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--text-secondary);
		text-align: center;
		margin-bottom: var(--space-4);
	}

	.result-section {
		display: flex;
		flex-direction: column;
	}

	.result-card {
		padding: var(--space-6);
		background: var(--bg-elevated);
		border-radius: var(--radius-md);
		text-align: center;
	}

	.result-text {
		font-family: var(--font-display);
		font-size: var(--text-xl);
		font-weight: 600;
		color: var(--text-primary);
	}

	.stats-section {
		display: flex;
		flex-direction: column;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-4);
		background: var(--bg-card);
		border-radius: var(--radius-md);
	}

	.stat-value {
		font-family: var(--font-display);
		font-size: var(--text-3xl);
		font-weight: 700;
		color: var(--accent-primary);
	}

	.stat-label {
		font-size: var(--text-sm);
		color: var(--text-secondary);
	}

	.summary-footer {
		padding-top: var(--space-4);
	}

	@keyframes celebrate-pop {
		0% {
			transform: scale(0) rotate(-10deg);
			opacity: 0;
		}
		60% {
			transform: scale(1.2) rotate(5deg);
			opacity: 1;
		}
		100% {
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
	}
</style>
