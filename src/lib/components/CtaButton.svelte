<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		variant?: 'solid' | 'ghost';
		external?: boolean;
		children: Snippet;
	}

	let { href, variant = 'solid', external = false, children }: Props = $props();
</script>

<a
	{href}
	class="cta {variant}"
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
>
	{@render children()}
</a>

<style>
	.cta {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-body);
		font-size: 0.92rem;
		font-weight: 500;
		letter-spacing: 0.01em;
		text-decoration: none;
		padding: 13px 26px;
		border-radius: var(--radius-btn);
		transition:
			background 0.25s ease,
			border-color 0.25s ease,
			box-shadow 0.25s ease,
			transform 0.25s ease;
	}
	.cta:hover {
		transform: translateY(-1px);
	}
	.cta:active {
		transform: translateY(0);
	}

	.solid {
		background: var(--blue);
		color: var(--ink);
		box-shadow: 0 0 0 0 var(--blue-glow);
	}
	.solid:hover {
		box-shadow: 0 8px 32px -8px var(--blue-glow);
	}

	.ghost {
		background: var(--glass-bg);
		color: var(--paper);
		border: 1px solid var(--line);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		box-shadow: var(--glass-highlight);
	}
	.ghost:hover {
		background: var(--glass-bg-hover);
		border-color: rgba(91, 124, 255, 0.4);
	}
</style>
