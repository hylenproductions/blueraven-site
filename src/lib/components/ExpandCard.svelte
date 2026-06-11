<script lang="ts">
	import type { Snippet } from 'svelte';
	import GlassCard from './GlassCard.svelte';

	interface Props {
		title: string;
		summary?: string;
		expanded?: boolean;
		children: Snippet;
	}

	let { title, summary, expanded = false, children }: Props = $props();

	// `expanded` is intentionally captured as an initial value only.
	// svelte-ignore state_referenced_locally
	let open = $state(expanded);
	const panelId = $props.id();
</script>

<GlassCard tilt={false}>
	<div class="head">
		<div class="copy">
			<h3>{title}</h3>
			{#if summary}
				<p class="summary">{summary}</p>
			{/if}
		</div>
		<button
			class="toggle"
			class:open
			aria-expanded={open}
			aria-controls="panel-{panelId}"
			onclick={() => (open = !open)}
		>
			<span aria-hidden="true">+</span>
			<span class="sr-only">{open ? 'Collapse' : 'Expand'} {title}</span>
		</button>
	</div>
	<div class="panel" class:open id="panel-{panelId}">
		<div class="panel-inner">
			<div class="panel-body">
				{@render children()}
			</div>
		</div>
	</div>
</GlassCard>

<style>
	.head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
	}
	h3 {
		font-size: var(--text-h3);
		margin-bottom: 8px;
	}
	.summary {
		color: var(--slate);
		font-size: 0.94rem;
		line-height: 1.6;
	}
	.toggle {
		flex-shrink: 0;
		width: 38px;
		height: 38px;
		border-radius: 50%;
		border: 1px solid var(--line);
		background: var(--glass-bg);
		color: var(--paper);
		font-size: 1.3rem;
		line-height: 1;
		display: grid;
		place-items: center;
		transition:
			border-color 0.25s ease,
			background 0.25s ease;
	}
	.toggle span[aria-hidden] {
		display: block;
		transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.toggle.open span[aria-hidden] {
		transform: rotate(45deg);
	}
	.toggle:hover {
		border-color: rgba(91, 124, 255, 0.4);
		background: var(--blue-soft);
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	/* Height animation via grid rows — no JS measurement */
	.panel {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.panel.open {
		grid-template-rows: 1fr;
	}
	.panel-inner {
		overflow: hidden;
	}
	.panel-body {
		padding-top: 18px;
		color: var(--slate);
		font-size: 0.94rem;
		line-height: 1.7;
	}
</style>
