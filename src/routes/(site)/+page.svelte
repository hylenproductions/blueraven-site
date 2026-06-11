<script lang="ts">
	import SignalField from '$lib/components/SignalField.svelte';
	import SectionLabel from '$lib/components/SectionLabel.svelte';
	import CtaButton from '$lib/components/CtaButton.svelte';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import ExpandCard from '$lib/components/ExpandCard.svelte';

	const GITHUB = 'https://github.com/hylenproductions/blueraven';
</script>

<svelte:head>
	<title>Blue Raven · Open IoT Protocol</title>
	<meta
		name="description"
		content="An open protocol and certification standard for IoT hardware. Your data belongs to you."
	/>
</svelte:head>

<!-- ─── HERO ─────────────────────────────────────────────────────── -->
<section class="hero">
	<SignalField />
	<div class="hero-content container">
		<h1>
			<span class="line">Bluetooth standardized how devices talk.</span>
			<span class="line accent">Blue Raven standardizes who they answer to.</span>
		</h1>
		<p class="stats">
			OPEN PROTOCOL&nbsp;&nbsp;·&nbsp;&nbsp;APACHE 2.0&nbsp;&nbsp;·&nbsp;&nbsp;YOUR DATA
		</p>
		<div class="hero-ctas">
			<CtaButton href={GITHUB} external>View the spec</CtaButton>
			<CtaButton href="#contact" variant="ghost">Get in touch</CtaButton>
		</div>
	</div>
	<div class="hero-fade" aria-hidden="true"></div>
</section>

<!-- ─── PROBLEM — 3 columns ──────────────────────────────────────── -->
<section class="problem">
	<div class="container">
		<SectionLabel text="THE PROBLEM" />
		<div class="grid-3 problem-grid">
			<div class="problem-col">
				<h3>Every sensor wants a subscription.</h3>
				<p>
					Hardware you bought outright still bills you monthly just to read its own measurements.
				</p>
			</div>
			<div class="problem-col">
				<h3>Every device wants a login.</h3>
				<p>
					An account, an app, and a terms-of-service update, all standing between you and a
					thermometer in your own kitchen.
				</p>
			</div>
			<div class="problem-col">
				<h3>Every byte routes through someone else's server.</h3>
				<p>
					Someone with a financial interest in what you do with your data, and the power to raise
					prices once you've built on it.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- ─── BIG MARK ─────────────────────────────────────────────────── -->
<section class="mark">
	<div class="container mark-inner">
		<p class="mark-label section-label">THE STANDARD</p>
		<p class="mark-word">Blue&nbsp;Raven</p>
		<p class="mark-sub">
			An open protocol and certification standard for IoT hardware.<br />
			If it carries the mark, the data it generates belongs to you.
		</p>
	</div>
</section>

<!-- ─── THESIS ───────────────────────────────────────────────────── -->
<section class="thesis">
	<div class="container">
		<p class="thesis-line">
			Build for yourself. <span class="accent-text">Never for a corporation.</span>
		</p>
		<p class="thesis-sub">
			Every account, every subscription, every "works with" badge is a leash. Blue Raven hardware
			has no leash to hold.
		</p>
	</div>
</section>

<!-- ─── THE LANDSCAPE ────────────────────────────────────────────── -->
<section class="landscape">
	<div class="container">
		<SectionLabel text="THE LANDSCAPE" />
		<div class="grid-3 landscape-grid">
			<div class="land-col">
				<h3>"Works with" ecosystems</h3>
				<p>
					The device answers to Amazon, Google, or Apple. Your data lives in their cloud, behind
					their account, under their terms. When they sunset the service, your hardware dies with
					it.
				</p>
			</div>
			<div class="land-col">
				<h3>Matter</h3>
				<p>
					A real step: one standard so devices from different brands can talk. But it is run by a
					consortium of those same corporations, certification costs thousands, and you still drive
					everything through their controller apps. Built for manufacturers selling into ecosystems.
				</p>
			</div>
			<div class="land-col highlight">
				<h3>Blue Raven</h3>
				<p>
					Built for people building for themselves. The device posts to your endpoint or answers
					your queries on your own network. No account, no controller app, no consortium fee. Apache
					2.0: fork it and judge us by what's there.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- ─── FEATURES — 3 expandable cards ────────────────────────────── -->
<section class="features">
	<div class="container">
		<SectionLabel text="THE GUARANTEE" />
		<div class="grid-3 features-grid">
			<ExpandCard
				title="Open Protocol"
				summary="A common language for hardware that anyone can read, implement, and fork."
			>
				The full specification lives in the open, licensed Apache 2.0. No royalties, no member fees,
				no certification gatekeeping by a vendor consortium. Read it, fork it, build on it, and
				judge us by what's there.
			</ExpandCard>
			<ExpandCard
				title="Certification Standard"
				summary="Hardware carrying the mark meets a verifiable bar for openness."
			>
				Certification guarantees the device exposes its data locally, works without an account, and
				keeps working if the manufacturer disappears. No dark patterns, no silent firmware
				lock-outs, no features held hostage.
			</ExpandCard>
			<ExpandCard
				title="Data Sovereignty"
				summary="You control your data, your endpoints, and your connections."
			>
				Blue Raven devices answer to you. Not a platform, not a corporation, not a cloud you didn't
				choose. Point them at your own stack, your own storage, your own rules. No lock-in. No
				conflict of interest.
			</ExpandCard>
		</div>
	</div>
</section>

<!-- ─── USE CASES — teaser ───────────────────────────────────────── -->
<section class="usecases">
	<div class="container">
		<SectionLabel text="FOR BUILDERS" />
		<div class="grid-3 usecase-grid">
			<GlassCard glow>
				<h3>Build</h3>
				<p>
					Shipping an app that needs hardware inputs which don't route through Amazon? Certified
					devices speak directly to your stack.
				</p>
			</GlassCard>
			<GlassCard glow>
				<h3>Sense</h3>
				<p>
					Building a personal OS for your health, home, or garden? Blue Raven sensors feed your
					infrastructure, not theirs.
				</p>
			</GlassCard>
			<GlassCard glow>
				<h3>Own</h3>
				<p>
					Making hardware people can trust? Certification tells your customers their data stays
					theirs. That trust is a feature no platform can match.
				</p>
			</GlassCard>
		</div>
		<div class="usecase-cta">
			<CtaButton href="/vibecoders" variant="ghost">For vibe coders →</CtaButton>
			<CtaButton href="/builders" variant="ghost">For builders →</CtaButton>
		</div>
	</div>
</section>

<!-- ─── FINAL CTA ────────────────────────────────────────────────── -->
<section class="final">
	<div class="container final-inner">
		<h2>Read the spec.<br />Fork it. Build on it.</h2>
		<p class="final-sub">Judge us by what's there.</p>
		<div class="final-ctas">
			<CtaButton href={GITHUB} external>github.com/hylenproductions/blueraven ↗</CtaButton>
		</div>
	</div>
</section>

<style>
	/* ─── HERO ──────────────────────────────────────────────────── */
	.hero {
		position: relative;
		min-height: calc(100vh - 68px);
		display: flex;
		align-items: center;
		contain: layout paint;
	}
	.hero-content {
		position: relative;
		z-index: 2;
		text-align: center;
		width: 100%;
		padding-block: 96px;
	}
	h1 {
		font-size: var(--text-hero);
		font-weight: 600;
		display: flex;
		flex-direction: column;
		gap: 0.1em;
		margin-bottom: 36px;
		text-shadow: 0 2px 24px rgba(10, 12, 18, 0.8);
	}
	.line {
		display: block;
		animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
	}
	.line.accent {
		color: var(--blue);
		animation-delay: 0.55s;
	}
	.stats {
		font-family: var(--font-mono);
		font-size: var(--text-label);
		letter-spacing: 0.18em;
		color: var(--slate);
		margin-bottom: 40px;
		animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both;
	}
	.hero-ctas {
		display: flex;
		justify-content: center;
		gap: 14px;
		flex-wrap: wrap;
		animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 1.1s both;
	}
	.hero-fade {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 160px;
		background: linear-gradient(to bottom, transparent, var(--ink));
		z-index: 1;
		pointer-events: none;
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ─── PROBLEM ───────────────────────────────────────────────── */
	.problem {
		padding: var(--space-section) 0;
	}
	.problem-grid {
		margin-top: 52px;
		gap: clamp(32px, 4vw, 64px);
	}
	.problem-col h3 {
		font-size: var(--text-h3);
		margin-bottom: 14px;
	}
	.problem-col p {
		color: var(--slate);
		font-size: 0.95rem;
	}

	/* ─── BIG MARK ──────────────────────────────────────────────── */
	.mark {
		padding: var(--space-section) 0;
		border-top: 1px solid var(--line);
		background: radial-gradient(ellipse 70% 60% at 50% 50%, var(--blue-soft), transparent 70%);
	}
	.mark-inner {
		text-align: center;
	}
	.mark-label {
		margin-bottom: 28px;
	}
	.mark-word {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(3.4rem, 11vw, 9.5rem);
		line-height: 1;
		letter-spacing: -0.03em;
		color: var(--paper);
		text-shadow: 0 0 80px var(--blue-glow);
		margin-bottom: 28px;
	}
	.mark-sub {
		color: var(--slate);
		line-height: 1.8;
	}

	/* ─── THESIS ────────────────────────────────────────────────── */
	.thesis {
		padding: var(--space-section) 0;
		border-top: 1px solid var(--line);
	}
	.thesis-line {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: clamp(1.8rem, 4vw, 3.2rem);
		line-height: 1.25;
		letter-spacing: -0.01em;
		text-align: center;
		max-width: 920px;
		margin: 0 auto 20px;
	}
	.accent-text {
		color: var(--blue);
	}
	.thesis-sub {
		color: var(--slate);
		text-align: center;
		max-width: 560px;
		margin: 0 auto;
		line-height: 1.75;
	}

	/* ─── THE LANDSCAPE ─────────────────────────────────────────── */
	.landscape {
		padding: var(--space-section) 0;
		border-top: 1px solid var(--line);
	}
	.landscape-grid {
		margin-top: 52px;
		gap: clamp(24px, 3vw, 40px);
	}
	.land-col {
		padding: clamp(24px, 3vw, 32px);
		border: 1px solid var(--line);
		border-radius: var(--radius-card);
		background: var(--glass-bg);
	}
	.land-col h3 {
		font-size: var(--text-h3);
		margin-bottom: 14px;
		color: var(--slate);
	}
	.land-col p {
		color: var(--slate);
		font-size: 0.93rem;
		line-height: 1.75;
	}
	.land-col.highlight {
		border-color: rgba(91, 124, 255, 0.4);
		background: var(--blue-soft);
	}
	.land-col.highlight h3 {
		color: var(--blue);
	}
	.land-col.highlight p {
		color: var(--paper);
	}

	/* ─── FEATURES ──────────────────────────────────────────────── */
	.features {
		padding: var(--space-section) 0;
		border-top: 1px solid var(--line);
	}
	.features-grid {
		margin-top: 52px;
		align-items: start;
	}

	/* ─── USE CASES ─────────────────────────────────────────────── */
	.usecases {
		padding: var(--space-section) 0;
		border-top: 1px solid var(--line);
	}
	.usecase-grid {
		margin-top: 52px;
	}
	.usecase-grid h3 {
		font-size: var(--text-h3);
		margin-bottom: 12px;
		color: var(--blue);
	}
	.usecase-grid p {
		color: var(--slate);
		font-size: 0.95rem;
	}
	.usecase-cta {
		margin-top: 44px;
		display: flex;
		justify-content: center;
		gap: 14px;
		flex-wrap: wrap;
	}

	/* ─── FINAL CTA ─────────────────────────────────────────────── */
	.final {
		padding: var(--space-section) 0;
		border-top: 1px solid var(--line);
		background: radial-gradient(ellipse 60% 70% at 50% 100%, var(--blue-soft), transparent 70%);
	}
	.final-inner {
		text-align: center;
	}
	.final h2 {
		font-size: var(--text-h2);
		margin-bottom: 18px;
	}
	.final-sub {
		color: var(--slate);
		margin-bottom: 40px;
	}
	.final-ctas {
		display: flex;
		justify-content: center;
	}
</style>
