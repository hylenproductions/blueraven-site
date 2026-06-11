<script lang="ts">
	import { onMount } from 'svelte';

	const DISMISS_KEY = 'br_banner_ambassadors_v1';

	// SSR renders the banner; localStorage is checked after hydration.
	let dismissed = $state(false);

	onMount(() => {
		dismissed = localStorage.getItem(DISMISS_KEY) === '1';
	});

	function dismiss() {
		dismissed = true;
		localStorage.setItem(DISMISS_KEY, '1');
	}
</script>

{#if !dismissed}
	<div class="banner" role="region" aria-label="Announcement">
		<a href="/ambassadors" class="banner-link">
			<span class="date">JULY 30</span>
			<span class="text">
				Vibe Coders AI Hardware Ambassadors · live webinar hosted by Blue Raven
			</span>
			<span class="cta">Save your seat →</span>
		</a>
		<button class="close" onclick={dismiss} aria-label="Dismiss announcement">×</button>
	</div>
{/if}

<style>
	.banner {
		display: flex;
		align-items: center;
		background: linear-gradient(90deg, rgba(91, 124, 255, 0.18), rgba(91, 124, 255, 0.08));
		border-bottom: 1px solid rgba(91, 124, 255, 0.3);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
	}
	.banner-link {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 14px;
		flex-wrap: wrap;
		padding: 9px var(--pad-x);
		text-decoration: none;
		color: var(--paper);
		min-height: 38px;
	}
	.date {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		letter-spacing: 0.14em;
		color: var(--ink);
		background: var(--blue);
		border-radius: var(--radius-btn);
		padding: 3px 10px;
		flex-shrink: 0;
	}
	.text {
		font-size: 0.84rem;
		font-weight: 500;
	}
	.cta {
		font-family: var(--font-mono);
		font-size: 0.74rem;
		letter-spacing: 0.06em;
		color: var(--blue);
		white-space: nowrap;
	}
	.banner-link:hover .cta {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.close {
		flex-shrink: 0;
		font-size: 1.1rem;
		line-height: 1;
		color: var(--slate);
		padding: 8px 16px;
		transition: color 0.2s ease;
	}
	.close:hover {
		color: var(--paper);
	}

	@media (max-width: 640px) {
		.banner-link {
			gap: 8px;
			padding-block: 8px;
		}
		.text {
			font-size: 0.76rem;
		}
		.cta {
			display: none;
		}
	}
</style>
