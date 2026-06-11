<script lang="ts">
	import SectionLabel from '$lib/components/SectionLabel.svelte';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import CtaButton from '$lib/components/CtaButton.svelte';

	const GITHUB = 'https://github.com/hylenproductions/blueraven';
</script>

<svelte:head>
	<title>Vibe Coders · Blue Raven</title>
	<meta
		name="description"
		content="Your app needs real-world data. Blue Raven hardware feeds your stack without an ecosystem, an account, or a subscription."
	/>
</svelte:head>

<section class="vibecoders">
	<div class="container">
		<header class="head">
			<SectionLabel text="VIBE CODERS" />
			<h1>Your app needs real-world data.</h1>
			<p class="sub">
				You can build the software in a weekend. The hardware is where the dead ends start.
			</p>
		</header>

		<div class="story">
			<p class="story-label">WHY BLUE RAVEN EXISTS</p>
			<p>
				Blue Raven started with a health app. It needed one number every morning: body weight. After
				two days of typing it in by hand, the obvious move was a smart scale that could just post
				the number to the app.
			</p>
			<p>
				There wasn't one. Every digital scale on the market wanted a Google, Amazon, or Apple
				ecosystem, or worse, its own app. All the data went to someone's cloud, and the moment the
				subscription lapsed, the history was gone. A weekend project hit a wall that had nothing to
				do with code.
			</p>
			<p class="story-punch">
				That wall is the product. Blue Raven hardware posts to <span class="accent">your</span>
				endpoint, answers <span class="accent">your</span> queries, and works without anyone's permission.
			</p>
		</div>

		<div class="cards">
			<GlassCard glow>
				<p class="tag">01 · APP BUILDERS</p>
				<h2>Hardware that doesn’t route through Amazon.</h2>
				<p class="body">
					You’re shipping an app that needs real-world inputs: weight, temperature, moisture,
					motion, presence. Blue Raven certified devices expose their data directly to your backend.
					No third-party cloud in the loop, no per-device API fees, no partner program.
				</p>
			</GlassCard>
			<GlassCard glow>
				<p class="tag">02 · PERSONAL OS BUILDERS</p>
				<h2>Sensors that feed your stack, not theirs.</h2>
				<p class="body">
					You’re building personal infrastructure: health, home, garden, kitchen. Every certified
					sensor speaks a common protocol and points wherever you tell it. Your database, your
					dashboards, your rules. The mesh answers to you.
				</p>
			</GlassCard>
		</div>

		<div class="path">
			<p class="path-title">THE PATH</p>
			<ol>
				<li>
					<span class="step">1</span>
					<div>
						<h3>Pick your hardware</h3>
						<p>
							Browse the <a href="/marketplace">marketplace</a> and second the devices you want. The most-wanted
							ones get built first.
						</p>
					</div>
				</li>
				<li>
					<span class="step">2</span>
					<div>
						<h3>Or flash one today</h3>
						<p>
							Have an ESP32 lying around? The
							<a href={GITHUB} target="_blank" rel="noopener noreferrer">reference firmware ↗</a>
							turns it into a certified device in an afternoon.
						</p>
					</div>
				</li>
				<li>
					<span class="step">3</span>
					<div>
						<h3>Point it at your stack</h3>
						<p>
							The <a
								href="{GITHUB}/blob/main/docs/QUICKSTART.md"
								target="_blank"
								rel="noopener noreferrer">QUICKSTART ↗</a
							>
							has ready-made recipes for n8n, Replit, and Supabase + Vercel. Ten minutes from flash to
							data in your own database.
						</p>
					</div>
				</li>
			</ol>
		</div>

		<div class="ctas">
			<CtaButton href="/marketplace">Browse the marketplace</CtaButton>
			<CtaButton href={GITHUB} variant="ghost" external>Read the docs ↗</CtaButton>
		</div>

		<p class="crosslink">Making hardware instead? <a href="/builders">For builders →</a></p>
	</div>
</section>

<style>
	.vibecoders {
		padding: clamp(64px, 9vw, 120px) 0 var(--space-section);
	}
	.head {
		max-width: 720px;
		margin-bottom: clamp(48px, 6vw, 80px);
	}
	h1 {
		font-size: var(--text-h2);
		margin: 20px 0 18px;
	}
	.sub {
		color: var(--slate);
	}

	.story {
		max-width: 64ch;
		margin-bottom: clamp(56px, 7vw, 88px);
		display: flex;
		flex-direction: column;
		gap: 22px;
	}
	.story-label {
		font-family: var(--font-mono);
		font-size: var(--text-label);
		letter-spacing: 0.18em;
		color: var(--blue);
	}
	.story p:not(.story-label) {
		line-height: 1.85;
	}
	.story-punch {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 1.25rem;
		line-height: 1.5;
	}
	.accent {
		color: var(--blue);
	}

	.cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
		margin-bottom: clamp(56px, 7vw, 88px);
	}
	.tag {
		font-family: var(--font-mono);
		font-size: var(--text-label);
		letter-spacing: 0.18em;
		color: var(--blue);
		margin-bottom: 18px;
	}
	h2 {
		font-size: var(--text-h3);
		margin-bottom: 14px;
	}
	.body {
		color: var(--slate);
		font-size: 0.95rem;
		line-height: 1.75;
	}

	.path {
		margin-bottom: clamp(48px, 6vw, 72px);
	}
	.path-title {
		font-family: var(--font-mono);
		font-size: var(--text-label);
		letter-spacing: 0.18em;
		color: var(--blue);
		margin-bottom: 32px;
	}
	.path ol {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 28px;
		max-width: 640px;
	}
	.path li {
		display: flex;
		gap: 22px;
		align-items: flex-start;
	}
	.step {
		font-family: var(--font-mono);
		color: var(--blue);
		border: 1px solid rgba(91, 124, 255, 0.4);
		border-radius: 50%;
		width: 34px;
		height: 34px;
		display: grid;
		place-items: center;
		font-size: 0.85rem;
		flex-shrink: 0;
	}
	h3 {
		font-size: 1.05rem;
		margin-bottom: 6px;
	}
	.path p {
		color: var(--slate);
		font-size: 0.92rem;
		line-height: 1.7;
	}
	.path a {
		color: var(--paper);
		text-underline-offset: 3px;
	}
	.path a:hover {
		color: var(--blue);
	}

	.ctas {
		display: flex;
		gap: 14px;
		flex-wrap: wrap;
		margin-bottom: 40px;
	}
	.crosslink {
		color: var(--slate);
		font-size: 0.9rem;
	}
	.crosslink a {
		color: var(--paper);
		text-underline-offset: 3px;
	}
	.crosslink a:hover {
		color: var(--blue);
	}

	@media (max-width: 820px) {
		.cards {
			grid-template-columns: 1fr;
		}
	}
</style>
