<script lang="ts">
	import SectionLabel from '$lib/components/SectionLabel.svelte';

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

<svelte:head>
	<title>Ambassadors · Blue Raven</title>
	<meta
		name="description"
		content="Vibe Coders AI Hardware Ambassadors, hosted by Blue Raven. Live webinar July 30. Founding members shape the device roadmap."
	/>
</svelte:head>

<section class="ambassadors">
	<div class="container">
		<header class="head">
			<SectionLabel text="AMBASSADORS CLUB" />
			<h1>Vibe Coders<br />AI Hardware Ambassadors</h1>
			<p class="hosted">HOSTED BY BLUE RAVEN</p>
			<div class="datebox">
				<span class="date-big">JULY 30</span>
				<span class="date-sub">LIVE WEBINAR · DETAILS EMAILED AFTER SIGNUP</span>
			</div>
		</header>

		<div class="grid">
			<div class="pitch">
				<p class="lead">
					This is a rebellion against corporate-owned devices and corporate-owned data. Ambassadors
					are its founding members: people who build for themselves, never for a corporation.
				</p>
				<p class="lead-sub">
					Signing up isn't joining a mailing list. It's putting your name on the side that says your
					hardware answers to you.
				</p>
				<ul class="perks">
					<li>
						<h3>Shape the roadmap</h3>
						<p>
							Direct input on which devices get built next. The marketplace gets built around your
							stack, not the other way around.
						</p>
					</li>
					<li>
						<h3>Early hardware access</h3>
						<p>First units of every new certified device go to ambassadors before anyone else.</p>
					</li>
					<li>
						<h3>Founding member status</h3>
						<p>
							When the marketplace opens and the Blue Raven MCP server ships, ambassadors are the
							names on the wall. You were here before it was obvious.
						</p>
					</li>
				</ul>
			</div>

			<div class="signup">
				{#if status === 'sent'}
					<div class="sent" role="status">
						<p class="sent-big">You're in.</p>
						<p class="sent-sub">Webinar details land in your inbox before July 30.</p>
					</div>
				{:else}
					<form onsubmit={handleSubmit}>
						<input type="hidden" name="intent" value="ambassadors-webinar" />
						<p class="form-title">Save your seat</p>
						<label>
							<span>Name</span>
							<input type="text" name="name" required autocomplete="name" />
						</label>
						<label>
							<span>Email</span>
							<input type="email" name="email" required autocomplete="email" />
						</label>
						<label class="check">
							<input type="checkbox" name="newsletter" value="yes" checked />
							<span class="check-text">Also join the Blue Raven newsletter</span>
						</label>
						{#if status === 'error'}
							<p class="error" role="alert">Something went wrong. Please try again.</p>
						{/if}
						<button type="submit" disabled={status === 'sending'}>
							{status === 'sending' ? 'Sending…' : 'Sign me up'}
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.ambassadors {
		padding: clamp(64px, 9vw, 120px) 0 var(--space-section);
	}
	.head {
		text-align: center;
		margin-bottom: clamp(56px, 7vw, 88px);
	}
	h1 {
		font-size: clamp(2.2rem, 5vw, 4rem);
		margin: 20px 0 14px;
	}
	.hosted {
		font-family: var(--font-body);
		font-weight: 700;
		font-size: var(--text-label);
		letter-spacing: 0.22em;
		color: var(--slate);
		margin-bottom: 32px;
	}
	.datebox {
		display: inline-flex;
		flex-direction: column;
		gap: 8px;
		padding: 20px 36px;
		border: 1px solid rgba(91, 124, 255, 0.35);
		border-radius: var(--radius-card);
		background: var(--blue-soft);
	}
	.date-big {
		font-family: var(--font-display);
		font-weight: 900;
		font-size: 2rem;
		color: var(--blue);
		letter-spacing: 0.04em;
	}
	.date-sub {
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 0.66rem;
		letter-spacing: 0.14em;
		color: var(--slate);
	}

	.grid {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: clamp(40px, 6vw, 88px);
		align-items: start;
		max-width: 1000px;
		margin: 0 auto;
	}
	.lead {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.25rem;
		line-height: 1.55;
		margin-bottom: 18px;
	}
	.lead-sub {
		color: var(--slate);
		line-height: 1.75;
		margin-bottom: 36px;
	}
	.perks {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 26px;
	}
	.perks h3 {
		font-size: 1.05rem;
		margin-bottom: 6px;
		color: var(--blue);
	}
	.perks p {
		color: var(--slate);
		font-size: 0.93rem;
		line-height: 1.7;
	}

	.signup {
		background: var(--glass-bg);
		border: 1px solid var(--line);
		border-radius: var(--radius-card);
		box-shadow: var(--glass-highlight), var(--glass-shadow);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		padding: clamp(24px, 3vw, 36px);
	}
	.form-title {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.3rem;
		margin-bottom: 20px;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	label:not(.check) {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	label span:not(.check-text) {
		font-family: var(--font-body);
		font-weight: 700;
		font-size: var(--text-label);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--slate);
	}
	input[type='text'],
	input[type='email'] {
		font: inherit;
		color: var(--paper);
		background: rgba(10, 12, 18, 0.4);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 12px 16px;
		outline: none;
		transition: border-color 0.2s ease;
	}
	input:focus {
		border-color: var(--blue);
	}
	.check {
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
	}
	.check input {
		accent-color: var(--blue);
		width: 16px;
		height: 16px;
	}
	.check-text {
		font-size: 0.88rem;
		color: var(--slate);
	}
	button {
		font-weight: 500;
		font-size: 0.92rem;
		color: var(--ink);
		background: var(--blue);
		border-radius: var(--radius-btn);
		padding: 13px 28px;
		margin-top: 6px;
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
		text-align: center;
		padding: 24px 0;
	}
	.sent-big {
		font-family: var(--font-display);
		font-size: 1.6rem;
		font-weight: 600;
		margin-bottom: 8px;
	}
	.sent-sub {
		color: var(--slate);
	}

	@media (max-width: 820px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
