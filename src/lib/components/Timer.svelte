<script lang="ts">
	import { timerStore, progress, urgency, formattedTime, isRunning } from '$lib/stores/timer';
	import { onMount, onDestroy } from 'svelte';

	export let duration = 60;
	export let autoStart = false;
	export let onComplete: (() => void) | undefined = undefined;

	// Circle dimensions
	const size = 200;
	const strokeWidth = 12;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;

	$: offset = circumference * (1 - $progress);

	$: urgencyClass = $urgency;
	$: colorVar =
		$urgency === 'critical'
			? 'var(--danger)'
			: $urgency === 'warning'
				? 'var(--warning)'
				: 'var(--success)';

	onMount(() => {
		timerStore.init(duration);
		if (autoStart) {
			timerStore.start(onComplete);
		}
	});

	onDestroy(() => {
		timerStore.stop();
	});

	export function start() {
		timerStore.start(onComplete);
	}

	export function stop() {
		timerStore.stop();
	}

	export function complete() {
		timerStore.complete();
	}
</script>

<div
	class="timer"
	class:timer-warning={urgencyClass === 'warning'}
	class:timer-critical={urgencyClass === 'critical'}
>
	<svg class="timer-ring" width={size} height={size} viewBox="0 0 {size} {size}">
		<!-- Background circle -->
		<circle
			class="timer-ring-bg"
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke="var(--bg-elevated)"
			stroke-width={strokeWidth}
		/>

		<!-- Progress circle -->
		<circle
			class="timer-ring-progress"
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke={colorVar}
			stroke-width={strokeWidth}
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={offset}
			transform="rotate(-90 {size / 2} {size / 2})"
		/>

		<!-- Glow effect -->
		{#if $isRunning}
			<circle
				class="timer-ring-glow"
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="none"
				stroke={colorVar}
				stroke-width={strokeWidth + 8}
				stroke-linecap="round"
				stroke-dasharray={circumference}
				stroke-dashoffset={offset}
				transform="rotate(-90 {size / 2} {size / 2})"
				opacity="0.3"
			/>
		{/if}
	</svg>

	<div class="timer-display" style="color: {colorVar}">
		{$formattedTime}
	</div>
</div>

<style>
	.timer {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: fit-content;
	}

	.timer-ring {
		filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3));
	}

	.timer-ring-progress {
		transition:
			stroke-dashoffset 0.3s ease-out,
			stroke 0.3s ease-out;
	}

	.timer-ring-glow {
		filter: blur(8px);
		transition: stroke 0.3s ease-out;
	}

	.timer-display {
		position: absolute;
		font-family: var(--font-display);
		font-size: var(--text-5xl);
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		transition: color 0.3s ease-out;
	}

	/* Urgency animations are defined in animations.css */
</style>
