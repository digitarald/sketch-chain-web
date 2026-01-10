<script lang="ts">
	import { settingsStore } from '$lib/stores/settings';

	export let show = false;
	export let onClose: () => void;

	function handleBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}
</script>

{#if show}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-backdrop" on:click={handleBackdrop}>
		<div class="modal">
			<header class="modal-header">
				<h2>Settings</h2>
				<button class="close-btn" on:click={onClose}>×</button>
			</header>

			<div class="modal-content">
				<!-- Sound Toggle -->
				<div class="setting-row">
					<div class="setting-info">
						<span class="setting-label">Sound Effects</span>
						<span class="setting-desc">Play audio feedback</span>
					</div>
					<button
						class="toggle"
						class:active={$settingsStore.soundEnabled}
						on:click={() => settingsStore.toggle('soundEnabled')}
						aria-label="Toggle sound effects"
					>
						<span class="toggle-thumb"></span>
					</button>
				</div>

				<!-- Haptic Toggle -->
				<div class="setting-row">
					<div class="setting-info">
						<span class="setting-label">Vibration</span>
						<span class="setting-desc">Haptic feedback on events</span>
					</div>
					<button
						class="toggle"
						class:active={$settingsStore.hapticEnabled}
						on:click={() => settingsStore.toggle('hapticEnabled')}
						aria-label="Toggle haptic feedback"
					>
						<span class="toggle-thumb"></span>
					</button>
				</div>

				<!-- Draw Time -->
				<div class="setting-row">
					<div class="setting-info">
						<span class="setting-label">Drawing Time</span>
						<span class="setting-desc">{$settingsStore.drawTime} seconds</span>
					</div>
					<div class="time-buttons">
						<button
							class="time-btn"
							disabled={$settingsStore.drawTime <= 30}
							on:click={() => settingsStore.setSetting('drawTime', $settingsStore.drawTime - 15)}
						>
							−
						</button>
						<button
							class="time-btn"
							disabled={$settingsStore.drawTime >= 120}
							on:click={() => settingsStore.setSetting('drawTime', $settingsStore.drawTime + 15)}
						>
							+
						</button>
					</div>
				</div>

				<!-- Guess Time -->
				<div class="setting-row">
					<div class="setting-info">
						<span class="setting-label">Guessing Time</span>
						<span class="setting-desc">{$settingsStore.guessTime} seconds</span>
					</div>
					<div class="time-buttons">
						<button
							class="time-btn"
							disabled={$settingsStore.guessTime <= 15}
							on:click={() => settingsStore.setSetting('guessTime', $settingsStore.guessTime - 15)}
						>
							−
						</button>
						<button
							class="time-btn"
							disabled={$settingsStore.guessTime >= 90}
							on:click={() => settingsStore.setSetting('guessTime', $settingsStore.guessTime + 15)}
						>
							+
						</button>
					</div>
				</div>
			</div>

			<footer class="modal-footer">
				<button class="btn btn-secondary btn-block" on:click={onClose}> Done </button>
			</footer>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-4);
		z-index: 100;
		animation: fade-in 0.2s ease-out;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal {
		background: var(--bg-secondary);
		border-radius: var(--radius-xl);
		width: 100%;
		max-width: 360px;
		border: var(--border-thin);
		box-shadow: var(--shadow-lg);
		animation: slide-up 0.3s var(--ease-out-expo);
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-4) var(--space-6);
		border-bottom: var(--border-thin);
	}

	.modal-header h2 {
		font-family: var(--font-display);
		font-size: var(--text-xl);
		font-weight: 600;
	}

	.close-btn {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		color: var(--text-secondary);
		font-size: 1.5rem;
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: background-color var(--duration-fast) var(--ease-out-expo);
	}

	.close-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		color: var(--text-primary);
	}

	.modal-content {
		padding: var(--space-4) var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.modal-footer {
		padding: var(--space-4) var(--space-6);
		border-top: var(--border-thin);
	}

	.setting-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
	}

	.setting-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.setting-label {
		font-weight: 500;
		color: var(--text-primary);
	}

	.setting-desc {
		font-size: var(--text-sm);
		color: var(--text-secondary);
	}

	.toggle {
		position: relative;
		width: 52px;
		height: 28px;
		background: var(--bg-elevated);
		border: none;
		border-radius: var(--radius-full);
		cursor: pointer;
		transition: background-color var(--duration-fast) var(--ease-out-expo);
	}

	.toggle.active {
		background: var(--accent-primary);
	}

	.toggle-thumb {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 22px;
		height: 22px;
		background: var(--text-primary);
		border-radius: 50%;
		transition: transform var(--duration-fast) var(--ease-out-expo);
	}

	.toggle.active .toggle-thumb {
		transform: translateX(24px);
	}

	.time-buttons {
		display: flex;
		gap: var(--space-2);
	}

	.time-btn {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-elevated);
		border: none;
		border-radius: var(--radius-sm);
		color: var(--text-primary);
		font-size: var(--text-lg);
		font-weight: 600;
		cursor: pointer;
		transition:
			background-color var(--duration-fast) var(--ease-out-expo),
			transform var(--duration-fast) var(--ease-out-expo);
	}

	.time-btn:hover:not(:disabled) {
		background: var(--bg-card);
	}

	.time-btn:active:not(:disabled) {
		transform: scale(0.95);
	}

	.time-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
</style>
