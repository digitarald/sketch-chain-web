<script lang="ts">
	import { onMount } from 'svelte';
	import { playSound } from '$lib/stores/audio';
	import { triggerHaptic } from '$lib/utils/haptics';

	export let onSubmit: (guess: string) => void;
	export let playerNumber: number;

	let guess = '';
	let inputEl: HTMLInputElement;

	onMount(() => {
		// Auto-focus input
		setTimeout(() => {
			inputEl?.focus();
		}, 300);
	});

	function handleSubmit() {
		if (!guess.trim()) return;

		playSound('pop');
		triggerHaptic('medium');
		onSubmit(guess.trim());
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSubmit();
		}
	}
</script>

<div class="guess-container">
	<p class="label">Player {playerNumber}</p>

	<h2 class="guess-title">What do you see?</h2>

	<p class="guess-instruction">Look at the drawing and type your guess</p>

	<div class="input-wrapper">
		<input
			bind:this={inputEl}
			bind:value={guess}
			type="text"
			class="input guess-input"
			placeholder="Type your guess..."
			on:keydown={handleKeydown}
			autocomplete="off"
			autocapitalize="off"
			spellcheck="false"
		/>
	</div>

	<button class="btn btn-primary btn-lg btn-block" on:click={handleSubmit} disabled={!guess.trim()}>
		Submit Guess
	</button>
</div>

<style>
	.guess-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-6);
		width: 100%;
	}

	.guess-title {
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		font-weight: 600;
		color: var(--text-primary);
		text-align: center;
	}

	.guess-instruction {
		font-size: var(--text-base);
		color: var(--text-secondary);
		text-align: center;
	}

	.input-wrapper {
		width: 100%;
	}

	.guess-input {
		font-size: var(--text-xl);
		text-align: center;
		padding: var(--space-5);
	}

	.guess-input::placeholder {
		text-align: center;
	}
</style>
