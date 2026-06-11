<script lang="ts">
	const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xzdqawjp';

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

<section class="banner" id="contact">
	<div class="container inner">
		<div class="intro">
			<p class="section-label">CONTACT</p>
			<h2>Talk to us.</h2>
			<p class="sub">
				Building something for yourself? Making hardware? Done asking corporations for permission?<br
				/>
				We read everything.
			</p>
		</div>

		{#if status === 'sent'}
			<div class="sent" role="status">
				<p class="sent-big">Message sent.</p>
				<p class="sent-sub">We'll get back to you soon.</p>
			</div>
		{:else}
			<form onsubmit={handleSubmit}>
				<div class="row">
					<label>
						<span>Name</span>
						<input type="text" name="name" required autocomplete="name" />
					</label>
					<label>
						<span>Email</span>
						<input type="email" name="email" required autocomplete="email" />
					</label>
				</div>
				<label>
					<span>Message</span>
					<textarea name="message" rows="4" required></textarea>
				</label>
				{#if status === 'error'}
					<p class="error" role="alert">Something went wrong. Please try again.</p>
				{/if}
				<button type="submit" disabled={status === 'sending'}>
					{status === 'sending' ? 'Sending…' : 'Send message'}
				</button>
			</form>
		{/if}
	</div>
</section>

<style>
	.banner {
		border-top: 1px solid var(--line);
		background:
			radial-gradient(ellipse 60% 80% at 80% 50%, var(--blue-soft), transparent 70%),
			var(--ink-raised);
		padding: var(--space-section) 0;
	}
	.inner {
		display: grid;
		grid-template-columns: 1fr 1.1fr;
		gap: clamp(40px, 6vw, 96px);
		align-items: start;
	}
	h2 {
		font-size: var(--text-h2);
		margin: 16px 0 14px;
	}
	.sub {
		color: var(--slate);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 18px;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	label span {
		font-family: var(--font-body);
		font-weight: 700;
		font-size: var(--text-label);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--slate);
	}
	input,
	textarea {
		font: inherit;
		color: var(--paper);
		background: var(--glass-bg);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 13px 16px;
		outline: none;
		transition: border-color 0.2s ease;
		resize: vertical;
	}
	input:focus,
	textarea:focus {
		border-color: var(--blue);
	}

	button {
		align-self: flex-start;
		font-weight: 500;
		font-size: 0.92rem;
		color: var(--ink);
		background: var(--blue);
		border-radius: var(--radius-btn);
		padding: 13px 28px;
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

	.error {
		color: #ff7b7b;
		font-size: 0.88rem;
	}

	.sent {
		padding: 32px;
		border: 1px solid rgba(91, 124, 255, 0.3);
		border-radius: var(--radius-card);
		background: var(--blue-soft);
	}
	.sent-big {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 6px;
	}
	.sent-sub {
		color: var(--slate);
	}

	@media (max-width: 900px) {
		.inner {
			grid-template-columns: 1fr;
		}
		.row {
			grid-template-columns: 1fr;
		}
	}
</style>
