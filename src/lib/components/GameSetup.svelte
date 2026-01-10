<script lang="ts">
	import type { Difficulty } from '$lib/stores/game';

	export let players: number;
	export let difficulty: Difficulty;
	export let onPlayersChange: (count: number) => void;
	export let onDifficultyChange: (diff: Difficulty) => void;

	const playerOptions = [4, 5, 6, 7, 8, 9, 10, 11, 12];

	const difficultyOptions: { value: Difficulty; label: string; desc: string }[] = [
		{ value: 'easy', label: 'Easy', desc: 'Simple objects & animals' },
		{ value: 'medium', label: 'Medium', desc: 'Actions & compound words' },
		{ value: 'hard', label: 'Hard', desc: 'Abstract concepts & idioms' },
		{ value: 'chaotic', label: 'Chaotic', desc: 'Absurd combinations 🔥' }
	];
</script>

<div class="setup-container">
	<!-- Player Count -->
	<div class="setup-section">
		<h3 class="section-title">How Many Players?</h3>
		<div class="player-grid">
			{#each playerOptions as count}
				<button
					class="player-btn"
					class:selected={players === count}
					on:click={() => onPlayersChange(count)}
				>
					{count}
				</button>
			{/each}
		</div>
	</div>

	<!-- Difficulty -->
	<div class="setup-section">
		<h3 class="section-title">Difficulty</h3>
		<div class="difficulty-list">
			{#each difficultyOptions as opt}
				<button
					class="difficulty-btn"
					class:selected={difficulty === opt.value}
					on:click={() => onDifficultyChange(opt.value)}
				>
					<span class="diff-label">{opt.label}</span>
					<span class="diff-desc">{opt.desc}</span>
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.setup-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
		width: 100%;
	}

	.setup-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.section-title {
		font-family: var(--font-display);
		font-size: var(--text-xl);
		font-weight: 600;
		color: var(--text-primary);
		text-align: center;
	}

	.player-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: var(--space-2);
	}

	.player-btn {
		font-family: var(--font-ui);
		font-size: var(--text-lg);
		font-weight: 600;
		padding: var(--space-3) var(--space-2);
		background: var(--bg-elevated);
		border: 2px solid transparent;
		border-radius: var(--radius-md);
		color: var(--text-primary);
		cursor: pointer;
		transition:
			transform var(--duration-fast) var(--ease-out-expo),
			border-color var(--duration-fast) var(--ease-out-expo),
			background-color var(--duration-fast) var(--ease-out-expo);
		touch-action: manipulation;
	}

	.player-btn:hover {
		background: var(--bg-card);
	}

	.player-btn:active {
		transform: scale(0.95);
	}

	.player-btn.selected {
		background: var(--accent-primary);
		color: var(--text-inverse);
		border-color: var(--accent-secondary);
		box-shadow: 0 0 20px var(--accent-glow);
	}

	.difficulty-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.difficulty-btn {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-1);
		padding: var(--space-4);
		background: var(--bg-elevated);
		border: 2px solid transparent;
		border-radius: var(--radius-md);
		cursor: pointer;
		text-align: left;
		transition:
			transform var(--duration-fast) var(--ease-out-expo),
			border-color var(--duration-fast) var(--ease-out-expo),
			background-color var(--duration-fast) var(--ease-out-expo);
		touch-action: manipulation;
	}

	.difficulty-btn:hover {
		background: var(--bg-card);
	}

	.difficulty-btn:active {
		transform: scale(0.98);
	}

	.difficulty-btn.selected {
		border-color: var(--accent-primary);
		background: rgba(255, 107, 53, 0.1);
	}

	.diff-label {
		font-family: var(--font-display);
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--text-primary);
	}

	.difficulty-btn.selected .diff-label {
		color: var(--accent-primary);
	}

	.diff-desc {
		font-size: var(--text-sm);
		color: var(--text-secondary);
	}
</style>
