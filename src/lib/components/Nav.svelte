<script lang="ts">
	import { page } from '$app/state';

	const links = [
		{ href: '/manifesto', label: 'Manifesto' },
		{ href: '/marketplace', label: 'Marketplace' },
		{ href: '/vibecoders', label: 'Vibe Coders' },
		{ href: '/builders', label: 'Builders' }
	];

	let menuOpen = $state(false);
	const path = $derived(page.url.pathname);

	// Close the mobile sheet on navigation.
	$effect(() => {
		void path;
		menuOpen = false;
	});
</script>

<header class="nav-wrap">
	<nav class="nav container" aria-label="Main">
		<a href="/" class="wordmark">BLUE RAVEN</a>

		<div class="links" class:open={menuOpen}>
			{#each links as link (link.href)}
				<a href={link.href} class="link" class:active={path === link.href}>{link.label}</a>
			{/each}
			<a
				href="https://github.com/hylenproductions/blueraven"
				target="_blank"
				rel="noopener noreferrer"
				class="link"
			>
				GitHub <span class="arrow" aria-hidden="true">↗</span>
			</a>
			<a href="#contact" class="cta">Get in touch</a>
		</div>

		<button
			class="burger"
			aria-expanded={menuOpen}
			aria-label="Toggle menu"
			onclick={() => (menuOpen = !menuOpen)}
		>
			<span class:open={menuOpen}></span>
			<span class:open={menuOpen}></span>
		</button>
	</nav>
</header>

<style>
	.nav-wrap {
		position: relative;
		background: rgba(10, 12, 18, 0.55);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		border-bottom: 1px solid var(--line);
		box-shadow: var(--glass-highlight);
	}
	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 68px;
		width: 100%;
	}
	.wordmark {
		font-family: var(--font-display);
		font-weight: 900;
		font-size: 1rem;
		letter-spacing: 0.14em;
		text-decoration: none;
		color: var(--paper);
	}
	.wordmark:hover {
		color: var(--blue);
	}

	.links {
		display: flex;
		align-items: center;
		gap: 32px;
	}
	.link {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--slate);
		text-decoration: none;
		transition: color 0.2s ease;
	}
	.link:hover,
	.link.active {
		color: var(--paper);
	}
	.link.active {
		color: var(--blue);
	}
	.arrow {
		font-size: 0.8em;
	}

	.cta {
		font-size: 0.86rem;
		font-weight: 500;
		color: var(--paper);
		text-decoration: none;
		padding: 9px 20px;
		border-radius: var(--radius-btn);
		border: 1px solid rgba(91, 124, 255, 0.45);
		background: var(--blue-soft);
		transition:
			background 0.25s ease,
			border-color 0.25s ease;
	}
	.cta:hover {
		background: var(--blue);
		color: var(--ink);
		border-color: var(--blue);
	}

	.burger {
		display: none;
		flex-direction: column;
		justify-content: center;
		gap: 6px;
		width: 40px;
		height: 40px;
		padding: 8px;
	}
	.burger span {
		display: block;
		height: 2px;
		width: 100%;
		background: var(--paper);
		border-radius: 2px;
		transition: transform 0.3s ease;
	}
	.burger span.open:first-child {
		transform: translateY(4px) rotate(45deg);
	}
	.burger span.open:last-child {
		transform: translateY(-4px) rotate(-45deg);
	}

	@media (max-width: 768px) {
		.burger {
			display: flex;
		}
		.links {
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;
			padding: 24px var(--pad-x) 32px;
			background: rgba(10, 12, 18, 0.97);
			backdrop-filter: blur(var(--glass-blur));
			-webkit-backdrop-filter: blur(var(--glass-blur));
			border-bottom: 1px solid var(--line);
			transform: translateY(-110%);
			transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
			visibility: hidden;
		}
		.links.open {
			transform: translateY(0);
			visibility: visible;
		}
		.link {
			font-size: 1.1rem;
			padding: 10px 0;
		}
		.cta {
			margin-top: 12px;
		}
	}
</style>
