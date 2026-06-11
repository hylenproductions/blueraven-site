<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		tilt?: boolean;
		maxTilt?: number;
		glow?: boolean;
		children: Snippet;
	}

	let { tilt = true, maxTilt = 6, glow = false, children }: Props = $props();

	let rx = $state(0);
	let ry = $state(0);
	let hovering = $state(false);

	// Tilt only on devices with a real pointer and no reduced-motion preference.
	function tiltEnabled() {
		return (
			tilt &&
			typeof window !== 'undefined' &&
			window.matchMedia('(hover: hover)').matches &&
			!window.matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}

	function onpointermove(e: PointerEvent) {
		if (!tiltEnabled()) return;
		const el = e.currentTarget as HTMLElement;
		const rect = el.getBoundingClientRect();
		const nx = (e.clientX - rect.left) / rect.width - 0.5;
		const ny = (e.clientY - rect.top) / rect.height - 0.5;
		ry = nx * maxTilt;
		rx = -ny * maxTilt;
		hovering = true;
	}

	function onpointerleave() {
		rx = 0;
		ry = 0;
		hovering = false;
	}
</script>

<!-- Pointer handlers are decorative tilt only -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="glass-card"
	class:glow
	class:hovering
	style:transform="perspective(900px) rotateX({rx}deg) rotateY({ry}deg)"
	{onpointermove}
	{onpointerleave}
>
	{@render children()}
</div>

<style>
	.glass-card {
		position: relative;
		background: var(--glass-bg);
		border: 1px solid var(--line);
		border-radius: var(--radius-card);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		box-shadow: var(--glass-highlight), var(--glass-shadow);
		padding: clamp(24px, 3vw, 36px);
		transition:
			transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
			background 0.3s ease,
			border-color 0.3s ease,
			box-shadow 0.3s ease;
		transform-style: preserve-3d;
		will-change: transform;
	}
	.glass-card.hovering {
		transition:
			transform 0.08s linear,
			background 0.3s ease,
			border-color 0.3s ease,
			box-shadow 0.3s ease;
		background: var(--glass-bg-hover);
	}
	.glass-card.glow.hovering {
		border-color: rgba(91, 124, 255, 0.35);
		box-shadow:
			var(--glass-highlight),
			var(--glass-shadow),
			0 0 48px -12px var(--blue-glow);
	}
</style>
