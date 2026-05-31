<script lang="ts">
	let email = $state('')
	let submitted = $state(false)
	let submitting = $state(false)

	async function handleSubscribe(e: SubmitEvent) {
		e.preventDefault()
		if (submitting || !email) return
		submitting = true
		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			})
			if (res.ok) submitted = true
		} catch {
			// error state wired with Resend integration
		} finally {
			submitting = false
		}
	}
</script>

<svelte:head>
	<title>Blue Raven — Open IoT Protocol</title>
	<meta
		name="description"
		content="An open protocol and certification standard for IoT hardware. Your data belongs to you."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;500;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Grain overlay — inline SVG so the filter renders in-document -->
<svg class="noise" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
	<filter id="grain-filter">
		<feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
		<feColorMatrix type="saturate" values="0" />
	</filter>
	<rect width="100%" height="100%" filter="url(#grain-filter)" opacity="0.035" />
</svg>

<!-- ─── NAV ─────────────────────────────────────────────────────── -->
<nav>
	<a href="/" class="monogram">BR</a>
	<div class="nav-links">
		<a
			href="https://github.com/hylenproductions/blueraven"
			target="_blank"
			rel="noopener noreferrer"
			class="nav-link">GitHub ↗</a
		>
		<a href="#stay-informed" class="nav-link">Stay Informed</a>
	</div>
</nav>

<!-- ─── HERO ─────────────────────────────────────────────────────── -->
<section class="hero">
	<div class="container">
		<h1 class="hero-headline">
			<span class="line" style="--d:0.1s">Bluetooth standardized how devices talk.</span>
			<span class="line" style="--d:0.75s">Blue Raven standardizes who they answer to.</span>
		</h1>
		<p class="hero-body" style="--d:0.85s">
			Blue Raven is an open protocol and certification standard<br />
			for IoT hardware. If it's Blue Raven certified, the data it<br />
			generates belongs to you — not a platform, not a corporation,<br />
			not a cloud you didn't choose.
		</p>
		<a
			href="https://github.com/hylenproductions/blueraven"
			target="_blank"
			rel="noopener noreferrer"
			class="cta-link"
			style="--d:1.1s"
		>
			Read the protocol →
		</a>

		<div class="gh-badge" style="--d:1.35s">
			<div class="gh-badge-top">
				<span class="gh-badge-label">Open Protocol</span>
				<a
					href="https://github.com/hylenproductions/blueraven"
					target="_blank"
					rel="noopener noreferrer"
					class="gh-badge-url"
				>
					github.com/hylenproductions/blueraven ↗
				</a>
			</div>
			<p class="gh-badge-tagline">
				Read the spec. Fork it. Build on it. Judge us by what's there.
			</p>
		</div>
	</div>
</section>

<!-- ─── MANIFESTO ────────────────────────────────────────────────── -->
<section class="manifesto">
	<div class="container">
		<div class="manifesto-layout">
			<p class="section-label">// MANIFESTO</p>
			<div class="manifesto-body">
				<p>
					We're at the beginning of something. People are building their own operating systems — for
					their health, their homes, their lives. Not apps. Not dashboards. Actual personal
					infrastructure that knows your nutrition goals, tracks your garden, monitors your kitchen,
					and connects all of it without asking a corporation for permission.
				</p>
				<p>
					The problem is the inputs. Every sensor wants a subscription. Every device wants a login.
					Every piece of hardware routes your data through someone else's server — someone with a
					financial interest in what you do with it.
				</p>
				<p class="pullquote">That's not a foundation. That's a liability.</p>
				<p>
					Blue Raven is the alternative. An open protocol. A certification standard. A guarantee
					that hardware carrying our name puts you in control of your data, your endpoints, and your
					connections. No lock-in. No conflict of interest. No platform that raises prices once
					you've built on it.
				</p>
				<p>
					Think of it like Bluetooth — a common language for hardware. Except instead of just
					standardizing how devices talk, Blue Raven standardizes who they answer to.
				</p>
				<p class="you">You.</p>
			</div>
		</div>
	</div>
</section>

<!-- ─── FOR BUILDERS ─────────────────────────────────────────────── -->
<section class="builders">
	<div class="container">
		<p class="section-label">// FOR BUILDERS</p>
		<div class="builders-cols">
			<div class="builder-col">
				<p>Building an app and need hardware<br />that doesn't route through Amazon?</p>
			</div>
			<div class="builder-col">
				<p>Building a personal OS and need sensors<br />that feed your stack, not theirs?</p>
			</div>
		</div>
		<p class="builders-summary">
			Blue Raven certified hardware works with whatever you're building — no ecosystem required.
		</p>
		<a
			href="https://github.com/hylenproductions/blueraven"
			target="_blank"
			rel="noopener noreferrer"
			class="cta-link"
		>
			Read the protocol spec on GitHub ↗
		</a>
	</div>
</section>

<!-- ─── STAY INFORMED ────────────────────────────────────────────── -->
<section class="email-capture" id="stay-informed">
	<div class="container">
		<p class="section-label">// STAY INFORMED</p>
		<h2 class="email-headline">The open hardware layer<br />is being built.</h2>
		<p class="email-subtext">
			Follow the protocol. Follow the certified products.<br />Stay out of the closed ecosystems.
		</p>

		{#if submitted}
			<p class="success">// you're on the list.</p>
		{:else}
			<form class="email-form" onsubmit={handleSubscribe}>
				<input
					type="email"
					name="email"
					placeholder="your@email.com"
					required
					bind:value={email}
				/>
				<button type="submit" disabled={submitting}>
					{submitting ? '...' : 'JOIN THE LIST'}
				</button>
			</form>
		{/if}
	</div>
</section>

<!-- ─── FOOTER ───────────────────────────────────────────────────── -->
<footer>
	<div class="container footer-inner">
		<span>© Blue Raven Protocol 2026</span>
		<span>Apache 2.0 · github.com/hylenproductions/blueraven</span>
	</div>
</footer>

<style>
	/* ─── Global resets ─────────────────────────────────────────── */
	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	:global(html) {
		scroll-behavior: smooth;
		/* Crosshair cursor — small SVG in #4A9EFF, 20×20px, hotspot centered */
		cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cline x1='10' y1='0' x2='10' y2='6' stroke='%234A9EFF' stroke-width='1.5'/%3E%3Cline x1='10' y1='14' x2='10' y2='20' stroke='%234A9EFF' stroke-width='1.5'/%3E%3Cline x1='0' y1='10' x2='6' y2='10' stroke='%234A9EFF' stroke-width='1.5'/%3E%3Cline x1='14' y1='10' x2='20' y2='10' stroke='%234A9EFF' stroke-width='1.5'/%3E%3Ccircle cx='10' cy='10' r='1.5' fill='%234A9EFF'/%3E%3C/svg%3E")
			10 10,
			crosshair;
	}
	:global(body) {
		background: #0d0d0d;
		color: white;
		font-family: 'Syne', sans-serif;
		-webkit-font-smoothing: antialiased;
	}
	:global(a) {
		cursor: inherit;
	}

	/* ─── Staggered load animation ──────────────────────────────── */
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

	/* ─── Noise overlay ─────────────────────────────────────────── */
	.noise {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
		z-index: 9999;
	}

	/* ─── Layout container ──────────────────────────────────────── */
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 48px;
	}

	/* ─── Section label ─────────────────────────────────────────── */
	.section-label {
		font-family: 'Space Mono', monospace;
		font-size: 0.7rem;
		color: #4a9eff;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		margin-bottom: 52px;
	}

	/* ─── CTA link — shared across sections ─────────────────────── */
	.cta-link {
		font-family: 'Space Mono', monospace;
		font-size: 0.875rem;
		color: #4a9eff;
		text-decoration: none;
		letter-spacing: 0.04em;
		display: inline-block;
		transition: opacity 0.2s;
		animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0s) both;
	}
	.cta-link:hover {
		opacity: 0.65;
	}

	/* ─── GitHub badge ──────────────────────────────────────────── */
	.gh-badge {
		display: inline-block;
		margin-top: 44px;
		padding: 18px 24px;
		border: 1px solid rgba(74, 158, 255, 0.22);
		border-left: 2px solid #4a9eff;
		background: rgba(74, 158, 255, 0.03);
		animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0s) both;
	}
	.gh-badge-top {
		display: flex;
		align-items: baseline;
		gap: 14px;
		flex-wrap: wrap;
		margin-bottom: 10px;
	}
	.gh-badge-label {
		font-family: 'Space Mono', monospace;
		font-size: 0.62rem;
		color: #4a9eff;
		letter-spacing: 0.22em;
		text-transform: uppercase;
	}
	.gh-badge-url {
		font-family: 'Space Mono', monospace;
		font-size: 0.8rem;
		color: #ccc;
		text-decoration: none;
		letter-spacing: 0.01em;
		transition: color 0.2s;
	}
	.gh-badge-url:hover {
		color: #4a9eff;
	}
	.gh-badge-tagline {
		font-family: 'Syne', sans-serif;
		font-size: 0.78rem;
		color: #444;
		line-height: 1.55;
	}

	/* ─── NAV ───────────────────────────────────────────────────── */
	nav {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px 48px;
		/* transparent — no background */
		pointer-events: none; /* pass-through except for links */
	}
	nav * {
		pointer-events: all;
	}
	.monogram {
		font-family: 'Space Mono', monospace;
		font-weight: 700;
		font-size: 1.05rem;
		color: #4a9eff;
		text-decoration: none;
		letter-spacing: 0.06em;
	}
	.nav-links {
		display: flex;
		gap: 36px;
	}
	.nav-link {
		font-family: 'Space Mono', monospace;
		font-size: 0.72rem;
		color: #555;
		text-decoration: none;
		letter-spacing: 0.1em;
		transition: color 0.2s;
	}
	.nav-link:hover {
		color: #4a9eff;
	}

	/* ─── HERO ──────────────────────────────────────────────────── */
	.hero {
		padding: 80px 0 160px;
		min-height: 88vh;
		display: flex;
		align-items: center;
	}
	.hero .container {
		width: 100%;
	}
	.hero-headline {
		font-family: 'Space Mono', monospace;
		font-size: clamp(2.6rem, 6.2vw, 5.8rem);
		font-weight: 700;
		line-height: 1.06;
		letter-spacing: -0.025em;
		color: white;
		display: flex;
		flex-direction: column;
		margin-bottom: 52px;
	}
	.line {
		display: block;
		animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0s) both;
	}
	.hero-body {
		font-family: 'Syne', sans-serif;
		font-size: clamp(0.95rem, 1.3vw, 1.05rem);
		color: #999;
		line-height: 1.8;
		margin-bottom: 44px;
		animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0s) both;
	}

	/* ─── MANIFESTO ─────────────────────────────────────────────── */
	.manifesto {
		padding: 140px 0;
		border-top: 1px solid #181818;
	}
	/*
	 * Asymmetric: label sits in a narrow left column, text in a wider right.
	 * The "You." overflows its column — the deliberate grid break.
	 */
	.manifesto-layout {
		display: grid;
		grid-template-columns: 200px 1fr;
		gap: 0 96px;
		align-items: start;
	}
	.manifesto-layout .section-label {
		margin-bottom: 0;
		padding-top: 4px;
		position: sticky;
		top: 80px;
	}
	.manifesto-body {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}
	.manifesto-body p {
		font-family: 'Syne', sans-serif;
		font-size: clamp(1rem, 1.25vw, 1.05rem);
		color: white;
		line-height: 1.85;
	}
	/* Higher specificity to override .manifesto-body p rules */
	.manifesto-body .pullquote {
		font-family: 'Space Mono', monospace;
		font-size: clamp(1rem, 1.35vw, 1.1rem);
		color: #bbb;
		line-height: 1.7;
		border-left: 2px solid #4a9eff;
		padding-left: 28px;
		margin: 8px 0;
	}
	/* "You." — the intentional grid break */
	.manifesto-body .you {
		font-family: 'Space Mono', monospace;
		font-size: clamp(5rem, 13.5vw, 12rem);
		font-weight: 700;
		line-height: 0.88;
		letter-spacing: -0.04em;
		color: #4a9eff;
		margin-top: 8px;
		/* Break past the column — extends into whitespace beyond the container */
		margin-right: -200px;
	}

	/* ─── FOR BUILDERS ──────────────────────────────────────────── */
	.builders {
		padding: 140px 0;
		border-top: 1px solid #181818;
	}
	/* Intentionally unequal columns — 55/45 instead of 50/50 */
	.builders-cols {
		display: grid;
		grid-template-columns: 11fr 9fr;
		gap: 40px 100px;
		margin-bottom: 64px;
	}
	.builder-col p {
		font-family: 'Space Mono', monospace;
		font-size: clamp(0.95rem, 1.4vw, 1.1rem);
		color: #bbb;
		line-height: 1.7;
	}
	.builders-summary {
		font-family: 'Syne', sans-serif;
		font-size: clamp(0.95rem, 1.2vw, 1rem);
		color: #666;
		line-height: 1.75;
		margin-bottom: 44px;
		max-width: 640px;
	}

	/* ─── EMAIL CAPTURE ─────────────────────────────────────────── */
	.email-capture {
		padding: 140px 0;
		border-top: 1px solid #181818;
	}
	.email-headline {
		font-family: 'Space Mono', monospace;
		font-size: clamp(1.5rem, 2.8vw, 2.3rem);
		font-weight: 700;
		color: white;
		line-height: 1.3;
		margin-bottom: 20px;
	}
	.email-subtext {
		font-family: 'Syne', sans-serif;
		font-size: clamp(0.9rem, 1.1vw, 0.98rem);
		color: #555;
		line-height: 1.75;
		margin-bottom: 52px;
	}
	.email-form {
		display: flex;
		gap: 10px;
		max-width: 500px;
	}
	.email-form input[type='email'] {
		flex: 1;
		background: #111;
		border: 1px solid #252525;
		border-radius: 2px;
		padding: 13px 18px;
		color: white;
		font-family: 'Space Mono', monospace;
		font-size: 0.82rem;
		outline: none;
		transition: border-color 0.2s;
		min-width: 0;
	}
	.email-form input[type='email']::placeholder {
		color: #3a3a3a;
	}
	.email-form input[type='email']:focus {
		border-color: #4a9eff;
	}
	.email-form button {
		background: #4a9eff;
		color: #0d0d0d;
		border: none;
		border-radius: 2px;
		padding: 13px 22px;
		font-family: 'Space Mono', monospace;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		white-space: nowrap;
		cursor: inherit;
		transition: opacity 0.2s;
	}
	.email-form button:hover:not(:disabled) {
		opacity: 0.82;
	}
	.email-form button:disabled {
		opacity: 0.45;
	}
	.success {
		font-family: 'Space Mono', monospace;
		font-size: 1.05rem;
		color: #4a9eff;
		letter-spacing: 0.05em;
	}

	/* ─── FOOTER ────────────────────────────────────────────────── */
	footer {
		border-top: 1px solid #222;
		padding: 36px 0;
	}
	.footer-inner {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.footer-inner span {
		font-family: 'Space Mono', monospace;
		font-size: 0.7rem;
		color: #444;
		letter-spacing: 0.06em;
	}

	/* ─── Mobile ────────────────────────────────────────────────── */
	@media (max-width: 768px) {
		.container {
			padding: 0 24px;
		}
		nav {
			padding: 20px 24px;
		}
		.nav-links {
			gap: 20px;
		}
		.hero {
			padding: 48px 0 96px;
			min-height: 80vh;
		}
		.manifesto {
			padding: 96px 0;
		}
		.manifesto-layout {
			grid-template-columns: 1fr;
			gap: 28px 0;
		}
		.manifesto-layout .section-label {
			position: static;
		}
		.manifesto-body .you {
			margin-right: 0;
		}
		.builders {
			padding: 96px 0;
		}
		.builders-cols {
			grid-template-columns: 1fr;
			gap: 28px;
		}
		.email-capture {
			padding: 96px 0;
		}
		.email-form {
			flex-direction: column;
			max-width: 100%;
		}
		.footer-inner {
			flex-direction: column;
			gap: 10px;
			text-align: center;
		}
	}

	@media (max-width: 480px) {
		.hero-headline {
			letter-spacing: -0.015em;
		}
	}
</style>
