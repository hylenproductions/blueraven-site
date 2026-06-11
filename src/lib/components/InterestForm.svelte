<script lang="ts">
	const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xzdqawjp';

	interface Props {
		product: string;
	}

	let { product }: Props = $props();

	let status = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (status === 'sending') return;
		status = 'sending';
		const form = e.currentTarget as HTMLFormElement;
		try {
			const res = await fetch(FORMSPREE_ENDPOINT, {
				method: 'POST',
				headers: { Accept: 'application/json' },
				body: new FormData(form)
			});
			status = res.ok ? 'sent' : 'error';
		} catch {
			status = 'error';
		}
	}
</script>

{#if status === 'sent'}
	<p class="sent" role="status">You're on the list. We'll keep you posted.</p>
{:else}
	<form onsubmit={handleSubmit}>
		<input type="hidden" name="product" value={product} />
		<input type="hidden" name="intent" value="marketplace-interest" />
		<input
			type="email"
			name="email"
			placeholder="you@example.com"
			required
			autocomplete="email"
			aria-label="Email for {product} updates"
		/>
		<button type="submit" disabled={status === 'sending'}>
			{status === 'sending' ? 'Sending…' : "I'm interested"}
		</button>
		{#if status === 'error'}
			<p class="error" role="alert">Something went wrong. Please try again.</p>
		{/if}
	</form>
{/if}

<style>
	form {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		align-items: center;
	}
	input[type='email'] {
		flex: 1 1 220px;
		font: inherit;
		font-size: 0.9rem;
		color: var(--paper);
		background: var(--glass-bg);
		border: 1px solid var(--line);
		border-radius: var(--radius-btn);
		padding: 11px 18px;
		outline: none;
		transition: border-color 0.2s ease;
	}
	input[type='email']::placeholder {
		color: var(--slate);
		opacity: 0.6;
	}
	input[type='email']:focus {
		border-color: var(--blue);
	}
	button {
		font-weight: 500;
		font-size: 0.88rem;
		color: var(--ink);
		background: var(--blue);
		border-radius: var(--radius-btn);
		padding: 11px 22px;
		white-space: nowrap;
		transition:
			box-shadow 0.25s ease,
			transform 0.25s ease,
			opacity 0.25s ease;
	}
	button:hover:not(:disabled) {
		box-shadow: 0 8px 32px -8px var(--blue-glow);
		transform: translateY(-1px);
	}
	button:disabled {
		opacity: 0.6;
	}
	.sent {
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 0.8rem;
		letter-spacing: 0.06em;
		color: var(--blue);
	}
	.error {
		flex-basis: 100%;
		color: #ff7b7b;
		font-size: 0.85rem;
	}
</style>
