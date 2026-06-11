<footer>
	<div class="container grid">
		<div class="brand">
			<p class="wordmark">BLUE RAVEN</p>
			<p class="mission">
				An open protocol and certification standard for IoT hardware. Your data belongs to you.
			</p>
		</div>
		<nav class="col" aria-label="Site">
			<p class="col-title">Site</p>
			<a href="/">Home</a>
			<a href="/manifesto">Manifesto</a>
			<a href="/marketplace">Marketplace</a>
			<a href="/vibecoders">Vibe Coders</a>
			<a href="/builders">Builders</a>
			<a href="/ambassadors">Ambassadors</a>
		</nav>
		<nav class="col" aria-label="Protocol">
			<p class="col-title">Protocol</p>
			<a
				href="https://github.com/hylenproductions/blueraven"
				target="_blank"
				rel="noopener noreferrer">GitHub ↗</a
			>
			<a
				href="https://github.com/hylenproductions/blueraven"
				target="_blank"
				rel="noopener noreferrer">Read the spec ↗</a
			>
			<span class="muted">Apache 2.0</span>
		</nav>
		<nav class="col" aria-label="Contact">
			<p class="col-title">Contact</p>
			<a href="#contact">Get in touch</a>
		</nav>
	</div>
	<div class="container bottom">
		<span>© Blue Raven Protocol 2026</span>
		<span>github.com/hylenproductions/blueraven</span>
	</div>
</footer>

<style>
	footer {
		border-top: 1px solid var(--line);
		padding: 72px 0 36px;
	}
	.grid {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		gap: 40px;
		margin-bottom: 64px;
	}
	.wordmark {
		font-family: var(--font-display);
		font-weight: 700;
		letter-spacing: 0.14em;
		margin-bottom: 14px;
	}
	.mission {
		color: var(--slate);
		font-size: 0.9rem;
		max-width: 320px;
	}
	.col {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.col-title {
		font-family: var(--font-mono);
		font-size: var(--text-label);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--slate);
		margin-bottom: 4px;
	}
	.col a {
		font-size: 0.9rem;
		color: var(--paper);
		text-decoration: none;
		width: fit-content;
	}
	.col a:hover {
		color: var(--blue);
	}
	.muted {
		font-size: 0.9rem;
		color: var(--slate);
	}
	.bottom {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding-top: 28px;
		border-top: 1px solid var(--line);
	}
	.bottom span {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: var(--slate);
	}

	@media (max-width: 768px) {
		.grid {
			grid-template-columns: 1fr 1fr;
		}
		.brand {
			grid-column: 1 / -1;
		}
		.bottom {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}
	}
</style>
