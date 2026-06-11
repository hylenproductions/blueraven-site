<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { submitVote } from '$lib/ideas';
	import type { Idea } from '$lib/types';
	import SectionLabel from './SectionLabel.svelte';

	const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xzdqawjp';

	let { ideas }: { ideas: Idea[] | null } = $props();

	// Seed optimistic counts once from the SSR payload; intentional initial capture.
	// svelte-ignore state_referenced_locally
	let counts = $state<Record<string, number>>(
		Object.fromEntries((ideas ?? []).map((i) => [i.id, i.vote_count]))
	);
	const voted = new SvelteSet<string>();
	let errorId = $state<string | null>(null);

	// Suggestion form state (Formspree, independent of Supabase)
	let suggestStatus = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');

	onMount(() => {
		try {
			const stored = localStorage.getItem('br_voted_ideas');
			if (stored) for (const id of JSON.parse(stored) as string[]) voted.add(id);
		} catch {
			// ignore bad localStorage
		}
	});

	function getVoterToken(): string {
		let token = localStorage.getItem('br_voter_token');
		if (!token) {
			token = crypto.randomUUID();
			localStorage.setItem('br_voter_token', token);
		}
		return token;
	}

	function persistVoted() {
		localStorage.setItem('br_voted_ideas', JSON.stringify([...voted]));
	}

	async function second(id: string) {
		if (voted.has(id)) return;

		// Optimistic update
		counts[id]++;
		voted.add(id);
		persistVoted();

		const ok = await submitVote(id, getVoterToken());
		if (!ok) {
			// Roll back
			counts[id]--;
			voted.delete(id);
			persistVoted();
			errorId = id;
			setTimeout(() => (errorId = null), 4000);
		}
	}

	async function handleSuggest(e: SubmitEvent) {
		e.preventDefault();
		if (suggestStatus === 'sending') return;
		suggestStatus = 'sending';
		const form = e.currentTarget as HTMLFormElement;
		try {
			const res = await fetch(FORMSPREE_ENDPOINT, {
				method: 'POST',
				headers: { Accept: 'application/json' },
				body: new FormData(form)
			});
			suggestStatus = res.ok ? 'sent' : 'error';
		} catch {
			suggestStatus = 'error';
		}
	}
</script>

<section class="ideas" id="ideas">
	<SectionLabel text="DEVICE IDEAS" />
	<h2>What should exist next?</h2>
	<p class="intro">
		Suggest a device below and it lands in our review queue. The ones we adopt show up here as
		official ideas, and anyone can second them. The most-seconded ideas shape the build order.
	</p>

	{#if ideas && ideas.length > 0}
		<ol class="list">
			{#each ideas as idea, i (idea.id)}
				<li class="idea">
					<span class="rank">{String(i + 1).padStart(2, '0')}</span>
					<div class="copy">
						<h3>{idea.title}</h3>
						<p>{idea.description}</p>
						{#if errorId === idea.id}
							<p class="error" role="alert">Couldn't record your vote. Try again.</p>
						{/if}
					</div>
					<button
						class="vote"
						class:done={voted.has(idea.id)}
						disabled={voted.has(idea.id)}
						onclick={() => second(idea.id)}
					>
						{voted.has(idea.id) ? 'Seconded ✓' : 'Second this'}
						<span class="count">{counts[idea.id]}</span>
					</button>
				</li>
			{/each}
		</ol>
	{/if}

	<div class="suggest">
		{#if suggestStatus === 'sent'}
			<p class="sent" role="status">
				Got it. If it makes the list, it shows up here for seconding.
			</p>
		{:else}
			<form onsubmit={handleSuggest}>
				<input type="hidden" name="intent" value="device-suggestion" />
				<div class="row">
					<input
						type="email"
						name="email"
						placeholder="you@example.com"
						required
						aria-label="Your email"
					/>
					<input
						type="text"
						name="idea"
						placeholder="The device you wish existed"
						required
						aria-label="Your device idea"
					/>
				</div>
				{#if suggestStatus === 'error'}
					<p class="error" role="alert">Something went wrong. Please try again.</p>
				{/if}
				<button type="submit" class="submit" disabled={suggestStatus === 'sending'}>
					{suggestStatus === 'sending' ? 'Sending…' : 'Suggest a device'}
				</button>
			</form>
		{/if}
	</div>
</section>

<style>
	.ideas {
		margin-top: var(--space-section);
		padding-top: var(--space-section);
		border-top: 1px solid var(--line);
	}
	h2 {
		font-size: var(--text-h2);
		margin: 18px 0 16px;
	}
	.intro {
		color: var(--slate);
		max-width: 62ch;
		margin-bottom: 48px;
	}

	.list {
		list-style: none;
		display: flex;
		flex-direction: column;
		margin-bottom: 56px;
	}
	.idea {
		display: flex;
		align-items: center;
		gap: clamp(16px, 3vw, 32px);
		padding: 24px 0;
		border-bottom: 1px solid var(--line);
	}
	.idea:first-child {
		border-top: 1px solid var(--line);
	}
	.rank {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--blue);
		flex-shrink: 0;
	}
	.copy {
		flex: 1;
	}
	h3 {
		font-size: 1.1rem;
		margin-bottom: 6px;
	}
	.copy p {
		color: var(--slate);
		font-size: 0.9rem;
		line-height: 1.6;
		max-width: 56ch;
	}

	.vote {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--paper);
		background: var(--glass-bg);
		border: 1px solid var(--line);
		border-radius: var(--radius-btn);
		padding: 10px 18px;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.vote:hover:not(:disabled) {
		border-color: rgba(91, 124, 255, 0.45);
		background: var(--blue-soft);
	}
	.vote.done {
		color: var(--blue);
		border-color: rgba(91, 124, 255, 0.45);
		background: var(--blue-soft);
		opacity: 1;
	}
	.count {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--blue);
	}

	.suggest {
		max-width: 720px;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 1.6fr;
		gap: 14px;
	}
	input {
		font: inherit;
		font-size: 0.9rem;
		color: var(--paper);
		background: var(--glass-bg);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 12px 16px;
		outline: none;
		transition: border-color 0.2s ease;
	}
	input::placeholder {
		color: var(--slate);
		opacity: 0.6;
	}
	input:focus {
		border-color: var(--blue);
	}
	.submit {
		align-self: flex-start;
		font-weight: 500;
		font-size: 0.88rem;
		color: var(--ink);
		background: var(--blue);
		border-radius: var(--radius-btn);
		padding: 12px 24px;
		transition:
			box-shadow 0.25s ease,
			transform 0.25s ease,
			opacity 0.25s ease;
	}
	.submit:hover:not(:disabled) {
		box-shadow: 0 8px 32px -8px var(--blue-glow);
		transform: translateY(-1px);
	}
	.submit:disabled {
		opacity: 0.6;
	}
	.sent {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		letter-spacing: 0.04em;
		color: var(--blue);
	}
	.error {
		color: #ff7b7b;
		font-size: 0.85rem;
		margin-top: 6px;
	}

	@media (max-width: 700px) {
		.idea {
			flex-wrap: wrap;
		}
		.vote {
			margin-left: calc(0.85rem + clamp(16px, 3vw, 32px));
		}
		.row {
			grid-template-columns: 1fr;
		}
	}
</style>
