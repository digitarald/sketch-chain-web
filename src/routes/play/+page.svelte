<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import Timer from '$lib/components/Timer.svelte';
	import WordCard from '$lib/components/WordCard.svelte';
	import PassPrompt from '$lib/components/PassPrompt.svelte';
	import GuessInput from '$lib/components/GuessInput.svelte';
	import Countdown from '$lib/components/Countdown.svelte';
	import {
		gameStore,
		phase,
		currentPlayer,
		players,
		currentWord,
		settings
	} from '$lib/stores/game';
	import { playSound } from '$lib/stores/audio';
	import { triggerHaptic } from '$lib/utils/haptics';

	let timerComponent: Timer;

	// Redirect to lobby if no game in progress
	onMount(() => {
		if ($phase === 'lobby') {
			goto(`${base}/`);
		}
	});

	// Phase handlers
	function handleCountdownComplete() {
		gameStore.transition('word-reveal');
	}

	function handleWordReady() {
		playSound('whoosh');
		gameStore.transition('drawing');
	}

	function handleDrawingComplete() {
		playSound('times-up');
		triggerHaptic('heavy');

		// Record that drawing was made
		gameStore.recordDrawing();

		gameStore.transition('pass-after-draw');
	}

	function handlePassAfterDraw() {
		gameStore.nextTurn();
		gameStore.transition('guessing');
	}

	function handleGuessSubmit(guess: string) {
		// Record the guess (this also updates currentWord for the next player)
		gameStore.recordGuess(guess);

		// Check if game is complete
		if (gameStore.isComplete()) {
			gameStore.transition('reveal');
			goto(`${base}/reveal`);
		} else {
			gameStore.transition('pass-after-guess');
		}
	}

	function handleGuessTimeout() {
		// Submit empty guess on timeout
		handleGuessSubmit('???');
	}

	function handlePassAfterGuess() {
		// Advance to the next player
		gameStore.nextTurn();

		// currentWord was already updated by recordGuess, so next player sees the guess
		// Transition to word-reveal for the next drawing phase
		gameStore.transition('word-reveal');
	}

	function handleSkipTimer() {
		timerComponent?.complete();
	}

	$: playerNum = $currentPlayer + 1;
	$: playerProgress = `Player ${playerNum} of ${$players}`;
</script>

<svelte:head>
	<title>Playing - Sketch Chain</title>
</svelte:head>

<div class="screen play">
	<!-- Progress header -->
	<header class="play-header">
		<span class="progress-info">{playerProgress}</span>
	</header>

	<main class="play-content">
		{#if $phase === 'countdown'}
			<Countdown onComplete={handleCountdownComplete} />
		{:else if $phase === 'word-reveal'}
			<WordCard word={$currentWord} playerNumber={playerNum} onReady={handleWordReady} />
		{:else if $phase === 'drawing'}
			<div class="timer-screen">
				<h2 class="phase-title">Draw!</h2>
				<p class="phase-instruction">Sketch the word on your paper</p>

				<div class="timer-wrapper">
					<Timer
						bind:this={timerComponent}
						duration={$settings.drawTime}
						autoStart={true}
						onComplete={handleDrawingComplete}
					/>
				</div>

				<button class="btn btn-secondary" on:click={handleSkipTimer}> I'm Done Early </button>
			</div>
		{:else if $phase === 'pass-after-draw'}
			<PassPrompt
				direction="left"
				instruction="Pass your sketchbook to the next player"
				onReady={handlePassAfterDraw}
			/>
		{:else if $phase === 'guessing'}
			<div class="guess-screen">
				<div class="timer-mini">
					<Timer
						bind:this={timerComponent}
						duration={$settings.guessTime}
						autoStart={true}
						onComplete={handleGuessTimeout}
					/>
				</div>

				<GuessInput playerNumber={playerNum} onSubmit={handleGuessSubmit} />
			</div>
		{:else if $phase === 'pass-after-guess'}
			<PassPrompt
				direction="left"
				instruction="Pass the sketchbook for the next round"
				onReady={handlePassAfterGuess}
			/>
		{/if}
	</main>
</div>

<style>
	.play {
		min-height: 100dvh;
		padding: var(--space-4);
		padding-top: calc(var(--safe-area-inset-top) + var(--space-4));
		padding-bottom: calc(var(--safe-area-inset-bottom) + var(--space-4));
		display: flex;
		flex-direction: column;
		max-width: var(--max-width);
		margin: 0 auto;
	}

	.play-header {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: var(--space-2) 0;
		margin-bottom: var(--space-4);
	}

	.progress-info {
		font-family: var(--font-display);
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--accent-primary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.play-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.timer-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-6);
		text-align: center;
		width: 100%;
	}

	.phase-title {
		font-family: var(--font-display);
		font-size: var(--text-3xl);
		font-weight: 700;
		color: var(--text-primary);
	}

	.phase-instruction {
		font-size: var(--text-lg);
		color: var(--text-secondary);
	}

	.timer-wrapper {
		padding: var(--space-8) 0;
	}

	.guess-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-6);
		width: 100%;
	}

	.timer-mini {
		transform: scale(0.6);
		transform-origin: center;
	}
</style>
